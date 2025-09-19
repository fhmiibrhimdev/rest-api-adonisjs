/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

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
  router.group(() => {
    router.get('/me', '#controllers/auth_controller.me')
    router.post('/refresh', '#controllers/auth_controller.refresh')
    router.post('/logout', '#controllers/auth_controller.logout')
    router.put('/profile', '#controllers/auth_controller.profile')
    router.put('/password', '#controllers/auth_controller.password')
  }).use(middleware.auth())
  
}).prefix('/api')

// Todos routes - Admin only
router.group(() => {
  router.resource('todos', '#controllers/todos_controller').apiOnly()
}).prefix('/api').use([middleware.auth(), middleware.admin()])

// Example: Routes with different role access levels
router.group(() => {
  // Admin only routes
  router.group(() => {
    router.get('/admin/dashboard', async () => ({ message: 'Admin Dashboard' }))
    router.get('/admin/users', async () => ({ message: 'All Users' }))
  }).use(middleware.admin())
  
  // Moderator and Admin routes
  router.group(() => {
    router.get('/moderate/reports', async () => ({ message: 'Reports for moderation' }))
    router.post('/moderate/ban-user', async () => ({ message: 'User banned' }))
  }).use(middleware.moderator())
  
  // Multiple specific roles using roles middleware
  router.group(() => {
    router.get('/special/feature', async () => ({ message: 'Special feature for admin and moderator' }))
  }).use(middleware.roles(['admin', 'moderator']))
  
}).prefix('/api').use(middleware.auth())
