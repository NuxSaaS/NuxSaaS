import { FileService, useFileManagerConfig } from '~~/server/services/file/fileService'
import { createStorageProvider } from '~~/server/services/file/storage/factory'

export default defineEventHandler(async (event) => {
  const config = useFileManagerConfig()
  const user = await requireAuth(event)
  const fileId = getRouterParam(event, 'id')

  if (!fileId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File ID is required'
    })
  }
  const storage = await createStorageProvider(config.storage)
  const fileService = new FileService(storage)

  const file = await fileService.getFile(fileId)

  if (!file) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found'
    })
  }

  if (file.uploadedBy !== user.id && user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied'
    })
  }

  const deleted = await fileService.deleteFile(fileId)

  return {
    success: deleted,
    message: deleted ? 'File deleted successfully' : 'File not found'
  }
})
