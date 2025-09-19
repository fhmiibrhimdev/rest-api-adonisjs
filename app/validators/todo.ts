import vine from '@vinejs/vine'

/**
 * Validator for creating a new todo
 */
export const createTodoValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255),
    date: vine.date({
      formats: ['YYYY-MM-DD', 'DD/MM/YYYY'],
    }),
  })
)

/**
 * Validator for updating a todo
 */
export const updateTodoValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255).optional(),
    date: vine.date({
      formats: ['YYYY-MM-DD', 'DD/MM/YYYY'],
    }).optional(),
  })
)

/**
 * Validator for todo query parameters
 */
export const todoQueryValidator = vine.compile(
  vine.object({
    page: vine.number().min(1).optional(),
    limit: vine.number().min(1).max(100).optional(),
    sortBy: vine.enum(['id', 'name', 'date', 'created_at']).optional(),
    sortOrder: vine.enum(['asc', 'desc']).optional(),
    search: vine.string().trim().optional(),
  })
)
