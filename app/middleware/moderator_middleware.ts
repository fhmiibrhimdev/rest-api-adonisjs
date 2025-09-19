import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Moderator middleware is used to check if the authenticated user has moderator role or higher
 */
export default class ModeratorMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
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

    // Check if user has moderator or admin role
    const allowedRoles = ['admin', 'moderator']
    if (!allowedRoles.includes(user.role)) {
      return response.status(403).json({
        success: false,
        message: 'Access denied. Moderator or Admin role required.',
      })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
