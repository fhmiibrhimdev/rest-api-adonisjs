import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('role', ['admin', 'user', 'moderator']).defaultTo('user').notNullable()
      table.boolean('is_active').defaultTo(true).notNullable()
      table.timestamp('email_verified_at').nullable()
      table.string('phone').nullable()
      table.date('birth_date').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('role')
      table.dropColumn('is_active')
      table.dropColumn('email_verified_at')
      table.dropColumn('phone')
      table.dropColumn('birth_date')
    })
  }
}