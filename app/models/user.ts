import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: 'admin' | 'user' | 'moderator'

  @column()
  declare isActive: boolean

  @column()
  declare phone: string | null

  @column.date()
  declare birthDate: DateTime | null

  @column.dateTime()
  declare emailVerifiedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  // Helper methods
  get isAdmin() {
    return this.role === 'admin'
  }

  get isModerator() {
    return this.role === 'moderator'
  }

  get isUser() {
    return this.role === 'user'
  }

  get isVerified() {
    return this.emailVerifiedAt !== null
  }

  // Serialize user data (exclude sensitive information)
  serialize() {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      role: this.role,
      isActive: this.isActive,
      phone: this.phone,
      birthDate: this.birthDate,
      emailVerifiedAt: this.emailVerifiedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}