import { relations } from 'drizzle-orm'
import { boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'
import { user } from './auth'

export const file = pgTable('file', {
  id: uuid('id').primaryKey().$default(() => uuidv7()),
  originalName: text('original_name').notNull(),
  fileName: text('file_name').notNull(),
  mimeType: text('mime_type').notNull(),
  fileType: text('file_type').notNull(),
  size: integer('size').notNull(),
  path: text('path').notNull(),
  url: text('url'),
  storageProvider: text('storage_provider').notNull(),
  uploadedBy: uuid('uploaded_by'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const fileRelations = relations(file, ({ one }) => ({
  uploadedByUser: one(user, {
    fields: [file.uploadedBy],
    references: [user.id]
  })
}))
