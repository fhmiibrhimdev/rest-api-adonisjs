import { middleware } from './kernel.js'
import router from '@adonisjs/core/services/router'

/**
 * Helper functions untuk mempermudah routing dengan role-based middleware
 */

// Helper untuk auth + role middleware
export const authRole = (role: string | string[]) => {
  if (typeof role === 'string') {
    // Single role
    switch (role) {
      case 'admin':
        return [middleware.auth(), middleware.admin()]
      case 'moderator':
        return [middleware.auth(), middleware.moderator()]
      default:
        return [middleware.auth(), middleware.roles([role])]
    }
  } else {
    // Multiple roles
    return [middleware.auth(), middleware.roles(role)]
  }
}

// Helper untuk auth only
export const auth = () => [middleware.auth()]

// Helper untuk specific combinations
export const adminOnly = () => [middleware.auth(), middleware.admin()]
export const moderatorUp = () => [middleware.auth(), middleware.moderator()]
export const staffOnly = () => [middleware.auth(), middleware.roles(['admin', 'moderator'])]

// Group helpers
export const authGroup = (callback: () => void) => {
  return router.group(callback).use(middleware.auth())
}

export const adminGroup = (callback: () => void) => {
  return router.group(callback).use([middleware.auth(), middleware.admin()])
}

export const moderatorGroup = (callback: () => void) => {
  return router.group(callback).use([middleware.auth(), middleware.moderator()])
}

export const roleGroup = (roles: string[], callback: () => void) => {
  return router.group(callback).use([middleware.auth(), middleware.roles(roles)])
}
