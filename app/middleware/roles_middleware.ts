import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Roles middleware is used to check if the authenticated user has one of the specified roles
 */
export default class RolesMiddleware {
  async handle(ctx: HttpContext, next: NextFn, guards: string[]) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const { auth, response } = ctx

    // Check if user is authenticated
    try {
      await auth.authenticate()
    } catch (error) {
      return response.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    // Get authenticated user
    const user = auth.getUserOrFail()

    // Check if user has one of the required roles
    if (!guards.includes(user.role)) {
      return response.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${guards.join(', ')}. Your role: ${user.role}`,
      })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}