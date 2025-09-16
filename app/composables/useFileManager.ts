export interface FileManagerConfig {
  maxSize?: number
  allowedTypes?: string[]
  onProgress?: (progress: number) => void
  onSuccess?: (file: any) => void
  onError?: (error: Error) => void
}

export function useFileManager(config: FileManagerConfig = {}) {
  const uploading = ref(false)
  const progress = ref(0)
  const error = ref<string | null>(null)

  const uploadToServer = async (file: File): Promise<any> => {
    if (config.maxSize && file.size > config.maxSize) {
      const errorMsg = `File size exceeds ${formatFileSize(config.maxSize)}`
      error.value = errorMsg
      config.onError?.(new Error(errorMsg))
      throw new Error(errorMsg)
    }

    if (config.allowedTypes && !config.allowedTypes.includes(file.type)) {
      const errorMsg = 'File type not allowed'
      error.value = errorMsg
      config.onError?.(new Error(errorMsg))
      throw new Error(errorMsg)
    }

    const formData = new FormData()
    formData.append('file', file)

    uploading.value = true
    progress.value = 0
    error.value = null

    try {
      const response = await $fetch('/api/file/upload', {
        method: 'POST',
        body: formData
      })
      config.onSuccess?.(response.file)
      return response.file
    } catch (err: any) {
      const errorMsg = err.data?.message || 'Upload failed'
      error.value = errorMsg
      config.onError?.(new Error(errorMsg))
      throw err
    } finally {
      uploading.value = false
    }
  }

  const uploadMultipleFiles = async (files: FileList | File[]): Promise<any[]> => {
    const fileArray = Array.from(files)
    const results = []

    for (const file of fileArray) {
      try {
        const result = await uploadToServer(file)
        results.push(result)
      } catch (err: any) {
        results.push({ error: err.message })
      }
    }

    return results
  }

  return {
    uploading: readonly(uploading),
    progress: readonly(progress),
    error: readonly(error),
    uploadToServer,
    uploadMultipleFiles
  }
}
