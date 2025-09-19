import type { HttpContext } from '@adonisjs/core/http'
import Todo from '#models/todo'
import { createTodoValidator, updateTodoValidator } from '#validators/todo'
import { DateTime } from 'luxon'

export default class TodosController {
  /**
   * Display a list of todos
   */
  async index({ response }: HttpContext) {
    try {
      const todos = await Todo.query().orderBy('date', 'desc')
      
      return response.json({
        success: true,
        data: {
          todos: todos,
        },
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Failed to fetch todos',
        error: error.message,
      })
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createTodoValidator)
      
      const todo = await Todo.create({
        name: payload.name,
        date: payload.date ? DateTime.fromJSDate(payload.date) : DateTime.now(),
      })

      return response.status(201).json({
        success: true,
        message: 'Todo created successfully',
        data: {
          todo: todo,
        },
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Failed to create todo',
        errors: error.messages || error.message,
      })
    }
  }

  /**
   * Show individual todo
   */
  async show({ params, response }: HttpContext) {
    try {
      const todo = await Todo.findOrFail(params.id)
      
      return response.json({
        success: true,
        data: {
          todo: todo,
        },
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Todo not found',
      })
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const todo = await Todo.findOrFail(params.id)
      const payload = await request.validateUsing(updateTodoValidator)

      // Update todo data
      if (payload.name !== undefined) {
        todo.name = payload.name
      }
      if (payload.date !== undefined) {
        todo.date = payload.date ? DateTime.fromJSDate(payload.date) : DateTime.now()
      }

      await todo.save()

      return response.json({
        success: true,
        message: 'Todo updated successfully',
        data: {
          todo: todo,
        },
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.status(404).json({
          success: false,
          message: 'Todo not found',
        })
      }
      
      return response.status(400).json({
        success: false,
        message: 'Failed to update todo',
        errors: error.messages || error.message,
      })
    }
  }

  /**
   * Delete todo
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const todo = await Todo.findOrFail(params.id)
      await todo.delete()

      return response.json({
        success: true,
        message: 'Todo deleted successfully',
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.status(404).json({
          success: false,
          message: 'Todo not found',
        })
      }
      
      return response.status(500).json({
        success: false,
        message: 'Failed to delete todo',
        error: error.message,
      })
    }
  }
}