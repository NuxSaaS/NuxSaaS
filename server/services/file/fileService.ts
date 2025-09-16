import type { Buffer } from 'node:buffer'
import type { StorageProvider } from './types'
import { extname } from 'node:path'
import { format } from 'date-fns'
import { and, desc, eq } from 'drizzle-orm'
import { v7 as uuidv7 } from 'uuid'
import { file as fileTable } from '~~/server/database/schema'
import { logAuditEvent } from '~~/server/utils/auditLogger'

export const useFileManagerConfig = () => {
  const config = useRuntimeConfig().fileManager
  if (!config) {
    throw createError({
      statusCode: 500,
      statusMessage: 'File manager configuration not found'
    })
  }
  return config
}

const getFileTypeFromMimeType = (mimeType: string) => {
  if (mimeType.startsWith('image/'))
    return 'image'
  if (mimeType.startsWith('video/'))
    return 'video'
  if (mimeType.startsWith('audio/'))
    return 'audio'
  if (mimeType.startsWith('text'))
    return 'text'
  if (mimeType.startsWith('application/'))
    return 'application'
  return 'other'
}

export class FileService {
  private storage: StorageProvider

  constructor(storage: StorageProvider) {
    this.storage = storage
  }

  private generateFileName(originalName: string): string {
    const fileId = uuidv7()
    const ext = extname(originalName)

    const dateFolder = format(new Date(), 'yyyy-MM-dd')

    const fileName = `${fileId}${ext}`

    // YYYY-MM-DD/uuid.ext
    return `${dateFolder}/${fileName}`
  }

  async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    uploadedBy?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<FileRecord> {
    const db = await useDB()
    const fileId = uuidv7()
    const fileName = this.generateFileName(originalName)
    const fileType = getFileTypeFromMimeType(mimeType)

    try {
      const { path, url } = await this.storage.upload(fileBuffer, fileName, mimeType)

      const fileData = {
        id: fileId,
        originalName,
        fileName,
        mimeType,
        fileType,
        size: fileBuffer.length,
        path,
        url,
        storageProvider: this.storage.name,
        uploadedBy,
        isActive: true
      }

      const [fileRecord] = await db.insert(fileTable).values(fileData).returning()
      if (!fileRecord) {
        throw createError({
          statusCode: 500,
          message: 'Failed to create file record'
        })
      }

      await logAuditEvent({
        userId: uploadedBy,
        category: 'file',
        action: 'upload',
        targetType: 'file',
        targetId: fileRecord.id,
        ipAddress,
        userAgent,
        status: 'success',
        details: JSON.stringify({
          originalName,
          fileName,
          mimeType,
          size: formatFileSize(fileBuffer.length),
          storageProvider: this.storage.name
        })
      })

      return fileRecord
    } catch (error) {
      await logAuditEvent({
        userId: uploadedBy,
        category: 'file',
        action: 'upload',
        targetType: 'file',
        ipAddress,
        userAgent,
        status: 'failure',
        details: JSON.stringify({
          originalName,
          mimeType,
          size: formatFileSize(fileBuffer.length),
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      })
      throw error
    }
  }

  async getFile(id: string): Promise<FileRecord | null> {
    const db = await useDB()
    try {
      const [fileRecord] = await db.select().from(fileTable).where(eq(fileTable.id, id)).limit(1)
      return fileRecord || null
    } catch {
      return null
    }
  }

  async deleteFile(id: string, userId?: string, ipAddress?: string, userAgent?: string): Promise<boolean> {
    const db = await useDB()
    const file = await this.getFile(id)

    if (!file) {
      return false
    }

    try {
      await this.storage.delete(file.path)
    } catch (error) {
      console.error('Failed to delete file from storage:', error)
    }

    await db.delete(fileTable).where(eq(fileTable.id, id))

    await logAuditEvent({
      userId,
      category: 'file',
      action: 'delete',
      targetType: 'file',
      targetId: id,
      ipAddress,
      userAgent,
      status: 'success',
      details: JSON.stringify({
        originalName: file.originalName,
        fileName: file.fileName,
        mimeType: file.mimeType,
        size: file.size
      })
    })

    return true
  }

  async getFilesByUser(userId: string, limit = 50, offset = 0): Promise<FileRecord[]> {
    const db = await useDB()
    return await db.select()
      .from(fileTable)
      .where(and(eq(fileTable.uploadedBy, userId), eq(fileTable.isActive, true)))
      .orderBy(desc(fileTable.createdAt))
      .limit(limit)
      .offset(offset)
  }
}
