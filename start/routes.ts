/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { authGroup, roleGroup } from './route_helpers.js'

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
    
    // Dashboard - accessible by all authenticated users regardless of role
    router.get('/dashboard', async ({ auth }) => {
      const user = auth.getUserOrFail()
      return {
        success: true,
        message: `Welcome to dashboard, your role is: ${user.role}!`,
      }
    })
  })
  
}).prefix('/api')

// Example routes dengan helper functions
router.group(() => {

  roleGroup(['admin', 'moderator'], () => {
    router.resource('todos', '#controllers/todos_controller').apiOnly()
  })

  roleGroup(['moderator'], () => {
    router.get('/moderator', async () => ({ message: 'Khusus untuk role moderator' }))
  })

  roleGroup(['user'], () => {
    router.get('/user', async () => ({ message: 'Khusus untuk role user' }))
  })

}).prefix('/api')
