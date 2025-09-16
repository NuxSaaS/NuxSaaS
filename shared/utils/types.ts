import type { file, user } from '~~/server/database/schema'

export type User = typeof user.$inferSelect
export type FileRecord = typeof file.$inferSelect
