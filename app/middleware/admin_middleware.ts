import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Admin middleware is used to check if the authenticated user has admin role
 */
export default class AdminMiddleware {
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

    // Check if user has admin role
    if (user.role !== 'admin') {
      return response.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.',
      })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
