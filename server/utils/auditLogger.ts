import { auditLog } from '../database/schema/auditLog'
import { getDB } from './db'

export async function logAuditEvent(data: {
  userId?: string
  category: 'auth' | 'email' | 'payment' | string
  action: string
  targetType?: string
  targetId?: string
  ipAddress?: string
  userAgent?: string
  status?: 'success' | 'failure' | 'pending'
  details?: string
}) {
  try {
    const db = getDB()
    await db.insert(auditLog).values({
      userId: data.userId,
      category: data.category,
      action: data.action,
      targetType: data.targetType,
      targetId: data.targetId,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      status: data.status || 'success',
      details: data.details
    })
  } catch (error) {
    console.error('Failed to log audit event:', error)
  }
}
