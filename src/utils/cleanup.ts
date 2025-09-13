import { StorageInterface } from '../types'

export class CleanupManager {
  private storage: StorageInterface
  private cleanupInterval: ReturnType<typeof setInterval> | null = null

  constructor(storage: StorageInterface) {
    this.storage = storage
  }

  startPeriodicCleanup(expirationDays: number, intervalHours: number = 24): void {
    // Clean up immediately
    this.performCleanup(expirationDays)

    // Set up periodic cleanup
    const intervalMs = intervalHours * 60 * 60 * 1000
    this.cleanupInterval = setInterval(() => {
      this.performCleanup(expirationDays)
    }, intervalMs)
  }

  async performCleanup(expirationDays: number): Promise<void> {
    try {
      await this.storage.cleanupExpiredLogs(expirationDays)
      console.log('Log cleanup completed successfully')
    } catch (error) {
      console.error('Failed to cleanup logs:', error)
    }
  }

  stopPeriodicCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }

  destroy(): void {
    this.stopPeriodicCleanup()
  }
}
