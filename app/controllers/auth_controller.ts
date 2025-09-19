import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  updateProfileValidator,
} from '#validators/auth'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

export default class AuthController {
  /**
   * Register a new user
   */
  async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)
      
      // Create user
      const user = await User.create({
        fullName: payload.fullName,
        email: payload.email,
        password: payload.password,
        phone: payload.phone,
        birthDate: payload.birthDate ? DateTime.fromJSDate(payload.birthDate) : null,
        role: payload.role || 'user', // Use provided role or default to 'user'
        isActive: true, // Default active
      })

      // Generate access token
      const token = await User.accessTokens.create(user)

      return response.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: user.serialize(),
          token: token,
        },
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Registration failed',
        errors: error.messages || error.message,
      })
    }
  }

  /**
   * Login user
   */
  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)

      // Find user by email
      const user = await User.verifyCredentials(email, password)

      // Check if user is active
      if (!user.isActive) {
        return response.status(403).json({
          success: false,
          message: 'Account is deactivated. Please contact support.',
        })
      }

      // Generate access token
      const token = await User.accessTokens.create(user)

      return response.json({
        success: true,
        message: 'Login successful',
        data: {
          user: user.serialize(),
          token: token,
        },
      })
    } catch (error) {
      return response.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }
  }

  /**
   * Get current authenticated user
   */
  async me({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      
      return response.json({
        success: true,
        data: {
          user: user.serialize(),
        },
      })
    } catch (error) {
      return response.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }
  }

  /**
   * Refresh token
   */
  async refresh({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      
      // Delete current token
      const currentToken = auth.user?.currentAccessToken
      if (currentToken) {
        await User.accessTokens.delete(auth.user!, currentToken.identifier)
      }
      
      // Generate new token
      const token = await User.accessTokens.create(user)

      return response.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          token: token,
        },
      })
    } catch (error) {
      return response.status(401).json({
        success: false,
        message: 'Failed to refresh token',
      })
    }
  }

  /**
   * Logout user
   */
  async logout({ auth, response }: HttpContext) {
    try {
      const currentToken = auth.user?.currentAccessToken
      if (currentToken) {
        await User.accessTokens.delete(auth.user!, currentToken.identifier)
      }
      
      return response.json({
        success: true,
        message: 'Logged out successfully',
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Failed to logout',
      })
    }
  }

  /**
   * Update user profile
   */
  async profile({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const payload = await request.validateUsing(updateProfileValidator)

      // Check email uniqueness if email is being updated
      if (payload.email && payload.email !== user.email) {
        const existingUser = await User.findBy('email', payload.email)
        if (existingUser) {
          return response.status(400).json({
            success: false,
            message: 'Email already exists',
            errors: {
              email: ['Email is already taken by another user']
            }
          })
        }
      }

      // Update user data manually to handle DateTime conversion
      if (payload.fullName !== undefined) {
        user.fullName = payload.fullName
      }
      if (payload.email !== undefined) {
        user.email = payload.email
      }
      if (payload.role !== undefined) {
        user.role = payload.role
      }
      if (payload.phone !== undefined) {
        user.phone = payload.phone
      }
      if (payload.birthDate !== undefined) {
        user.birthDate = payload.birthDate ? DateTime.fromJSDate(payload.birthDate) : null
      }

      await user.save()

      return response.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: user.serialize(),
        },
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Failed to update profile',
        errors: error.messages || error.message,
      })
    }
  }

  /**
   * Change user password
   */
  async password({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const { currentPassword, password } = await request.validateUsing(changePasswordValidator)

      // Verify current password
      const isCurrentPasswordValid = await hash.verify(user.password, currentPassword)
      if (!isCurrentPasswordValid) {
        return response.status(400).json({
          success: false,
          message: 'Current password is incorrect',
        })
      }

      // Update password
      user.password = password
      await user.save()

      return response.json({
        success: true,
        message: 'Password changed successfully',
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Failed to change password',
        errors: error.messages || error.message,
      })
    }
  }
}
