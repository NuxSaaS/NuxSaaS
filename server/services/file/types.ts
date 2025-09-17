import type { Buffer } from 'node:buffer'

export interface StorageProvider {
  name: string
  upload: (file: Buffer, fileName: string, mimeType: string) => Promise<{ path: string, url?: string }>
  delete: (path: string) => Promise<void>
  getUrl: (path: string) => string
  exists: (path: string) => Promise<boolean>
}

export type StorageProviderType = 'local' | 's3' | 'r2'

export interface FileManagerConfig {
  storage: {
    provider: StorageProviderType
    local?: {
      uploadDir: string
      publicPath: string
    }
    s3?: {
      region: string
      accessKeyId: string
      secretAccessKey: string
      bucketName: string
      publicUrl?: string
      endpoint?: string
    }
    r2?: {
      accountId: string
      accessKeyId: string
      secretAccessKey: string
      bucketName: string
      publicUrl?: string
    }
  }
  maxFileSize?: number
  allowedMimeTypes?: string[]
  uploadRateLimit?: {
    maxUploadsPerWindow: number // Maximum number of uploads allowed per window
    windowSizeMinutes: number // Size of the time window in minutes
  }
}
