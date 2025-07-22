import type { user } from '~~/server/database/schema'

export type User = typeof user.$inferSelect
