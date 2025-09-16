import type { Buffer } from 'node:buffer'
import type { StorageProvider } from '../types'
import { promises as fs } from 'node:fs'
import { dirname, join } from 'node:path'

export class LocalStorageProvider implements StorageProvider {
  name = 'local'
  private uploadDir: string
  private publicPath: string

  constructor(uploadDir: string, publicPath: string) {
    this.uploadDir = uploadDir
    this.publicPath = publicPath
  }

  async upload(file: Buffer, fileName: string): Promise<{ path: string, url?: string }> {
    const filePath = join(this.uploadDir, fileName)
    const dir = dirname(filePath)

    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(filePath, file)

    return {
      path: fileName,
      url: `${this.publicPath}/${fileName}`
    }
  }

  async delete(path: string): Promise<void> {
    const filePath = join(this.uploadDir, path)
    try {
      await fs.unlink(filePath)
    } catch (error) {
      if ((error as any).code !== 'ENOENT') {
        throw error
      }
    }
  }

  getUrl(path: string): string {
    return `${this.publicPath}/${path}`
  }

  async exists(path: string): Promise<boolean> {
    try {
      const filePath = join(this.uploadDir, path)
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  }
}
