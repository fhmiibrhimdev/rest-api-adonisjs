/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { authRole, adminOnly, moderatorUp, staffOnly, adminGroup, moderatorGroup, authGroup, roleGroup } from './route_helpers.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Authentication routes with /api prefix
router.group(() => {
  // Public routes (no authentication required)
  router.post('/register', '#controllers/auth_controller.register')
  router.post('/login', '#controllers/auth_controller.login')
  
  // Protected routes (authentication required)
  authGroup(() => {
    router.get('/me', '#controllers/auth_controller.me')
    router.post('/refresh', '#controllers/auth_controller.refresh')
    router.post('/logout', '#controllers/auth_controller.logout')
    router.put('/profile', '#controllers/auth_controller.profile')
    router.put('/password', '#controllers/auth_controller.password')
  })
  
}).prefix('/api')

// Todos routes - Admin only (menggunakan helper)
adminGroup(() => {
  router.resource('todos', '#controllers/todos_controller').apiOnly()
}).prefix('/api')

// Example routes dengan helper functions
router.group(() => {
  
  // Admin only routes (clean syntax)
  adminGroup(() => {
    router.get('/admin/dashboard', async () => ({ message: 'Admin Dashboard' }))
    router.get('/admin/users', async () => ({ message: 'All Users' }))
  })
  
  // Moderator and Admin routes (clean syntax)
  moderatorGroup(() => {
    router.get('/moderate/reports', async () => ({ message: 'Reports for moderation' }))
    router.post('/moderate/ban-user', async () => ({ message: 'User banned' }))
  })
  
  // Multiple specific roles (Laravel-like syntax)
  roleGroup(['admin', 'moderator'], () => {
    router.get('/special/feature', async () => ({ message: 'Special feature for admin and moderator' }))
    router.get('/staff/analytics', async () => ({ message: 'Analytics for staff' }))
  })
  
  // Single route dengan helper middleware
  router.get('/admin-only-route', async () => ({ message: 'Admin only' })).use(adminOnly())
  router.get('/moderator-up-route', async () => ({ message: 'Moderator or Admin' })).use(moderatorUp())
  router.get('/staff-route', async () => ({ message: 'Staff only' })).use(staffOnly())
  
  // Custom role combinations
  router.get('/custom-roles', async () => ({ message: 'Custom roles' })).use(authRole(['admin', 'user']))
  
}).prefix('/api')
