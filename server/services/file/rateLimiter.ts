import { cacheClient } from '~~/server/utils/drivers'

export class UploadRateLimiter {
  private windowSizeMinutes: number
  private maxUploadsPerWindow: number

  constructor(windowSizeMinutes: number, maxUploadsPerWindow: number) {
    this.windowSizeMinutes = windowSizeMinutes
    this.maxUploadsPerWindow = maxUploadsPerWindow
  }

  private getBucketKey(userId: string): string {
    const now = Date.now()
    const bucketTimestamp = Math.floor(now / (this.windowSizeMinutes * 60 * 1000))
    return `upload_rate_limit:${userId}:${bucketTimestamp}`
  }

  async checkAndIncrement(userId: string, incrementBy: number = 1): Promise<{ allowed: boolean, currentCount: number }> {
    const bucketKey = this.getBucketKey(userId)
    const ttlSeconds = this.windowSizeMinutes * 60

    try {
      // Get current count
      const currentValue = await cacheClient.get(bucketKey)
      const currentCount = currentValue ? Number.parseInt(currentValue) : 0

      // Check if limit would be exceeded after increment
      if (currentCount + incrementBy > this.maxUploadsPerWindow) {
        return { allowed: false, currentCount }
      }

      // Increment counter by the specified amount
      const newCount = currentCount + incrementBy
      await cacheClient.set(bucketKey, newCount.toString(), ttlSeconds)

      return { allowed: true, currentCount: newCount }
    } catch (error) {
      console.error('Rate limiter error:', error)
      return { allowed: false, currentCount: 0 }
    }
  }

  async getCurrentCount(userId: string): Promise<number> {
    const bucketKey = this.getBucketKey(userId)
    try {
      const currentValue = await cacheClient.get(bucketKey)
      return currentValue ? Number.parseInt(currentValue) : 0
    } catch (error) {
      console.error('Rate limiter get count error:', error)
      return 0
    }
  }
}
