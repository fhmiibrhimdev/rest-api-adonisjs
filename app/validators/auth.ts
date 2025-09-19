import vine from '@vinejs/vine'

/**
 * Validator for user registration
 */
export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(100),
    email: vine
      .string()
      .trim()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    password: vine.string().minLength(8).maxLength(100),
    passwordConfirmation: vine.string().sameAs('password'),
    role: vine.enum(['admin', 'user', 'moderator']).optional(),
    phone: vine.string().trim().optional(),
    birthDate: vine.date({
      formats: ['YYYY-MM-DD', 'DD/MM/YYYY'],
    }).optional(),
  })
)

/**
 * Validator for user login
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),
    password: vine.string().minLength(1),
  })
)

/**
 * Validator for password change
 */
export const changePasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string().minLength(1),
    password: vine.string().minLength(8).maxLength(100),
    passwordConfirmation: vine.string().sameAs('password'),
  })
)

/**
 * Validator for profile update
 */
export const updateProfileValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(100).optional(),
    email: vine.string().trim().email().normalizeEmail().optional(),
    role: vine.enum(['admin', 'user', 'moderator']).optional(),
    phone: vine.string().trim().optional(),
    birthDate: vine.date({
      formats: ['YYYY-MM-DD', 'DD/MM/YYYY'],
    }).optional(),
  })
)

/**
 * Validator for forgot password
 */
export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),
  })
)

/**
 * Validator for reset password
 */
export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string().trim(),
    email: vine.string().trim().email().normalizeEmail(),
    password: vine.string().minLength(8).maxLength(100),
    passwordConfirmation: vine.string().sameAs('password'),
  })
)
