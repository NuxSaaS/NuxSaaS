import type { FileManagerConfig, StorageProvider } from '../types'
import { LocalStorageProvider } from './local'
import { S3CompatibleStorageProvider } from './s3-compatible'

export async function createStorageProvider(config: FileManagerConfig['storage']): Promise<StorageProvider> {
  switch (config.provider) {
    case 'local':
      if (!config.local) {
        throw new Error('Local storage configuration is required')
      }
      return new LocalStorageProvider(config.local.uploadDir, config.local.publicPath)

    case 's3':
      if (!config.s3) {
        throw new Error('S3 storage configuration is required')
      }
      return new S3CompatibleStorageProvider({
        provider: 's3',
        ...config.s3
      })

    case 'r2':
      if (!config.r2) {
        throw new Error('R2 storage configuration is required')
      }
      return new S3CompatibleStorageProvider({
        provider: 'r2',
        ...config.r2
      })

    default:
      throw new Error(`Unsupported storage provider: ${config.provider}`)
  }
}
