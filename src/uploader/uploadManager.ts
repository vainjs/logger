import { LogEntry, StorageInterface, UploaderInterface, UploadStrategy } from '../types'
import { IdleDetector } from '../utils/idle'

export class UploadManager {
  private storage: StorageInterface
  private uploader: UploaderInterface
  private strategy: UploadStrategy
  private batchSize: number
  private idleDetector: IdleDetector
  private isUploading = false

  constructor(storage: StorageInterface, uploader: UploaderInterface, strategy: UploadStrategy, batchSize: number) {
    this.storage = storage
    this.uploader = uploader
    this.strategy = strategy
    this.batchSize = batchSize
    this.idleDetector = new IdleDetector()

    if (strategy === 'idle') {
      this.setupIdleUpload()
    }
  }

  async handleNewLog(log: LogEntry): Promise<void> {
    // Save log to storage first
    await this.storage.saveLog(log)

    // Handle upload based on strategy
    if (this.strategy === 'immediate') {
      await this.uploadImmediately([log])
    }
    // For idle strategy, logs will be uploaded when idle is detected
  }

  private async uploadImmediately(logs: LogEntry[]): Promise<void> {
    if (this.isUploading) {
      return
    }

    this.isUploading = true
    try {
      const success = await this.uploader.uploadLogs(logs)
      if (success) {
        const logIds = logs.map((log) => log.id)
        await this.storage.markAsUploaded(logIds)
      }
    } catch (error) {
      console.error('Failed to upload logs immediately:', error)
    } finally {
      this.isUploading = false
    }
  }

  private setupIdleUpload(): void {
    this.idleDetector.onIdle(async () => {
      await this.uploadPendingLogs()
    })
  }

  private async uploadPendingLogs(): Promise<void> {
    if (this.isUploading) {
      return
    }

    this.isUploading = true
    try {
      const unuploadedLogs = await this.storage.getUnuploadedLogs()

      if (unuploadedLogs.length === 0) {
        return
      }

      // Upload in batches
      for (let i = 0; i < unuploadedLogs.length; i += this.batchSize) {
        const batch = unuploadedLogs.slice(i, i + this.batchSize)
        const success = await this.uploader.uploadLogs(batch)

        if (success) {
          const logIds = batch.map((log) => log.id)
          await this.storage.markAsUploaded(logIds)
        } else {
          // If upload fails, stop processing remaining batches
          break
        }
      }
    } catch (error) {
      console.error('Failed to upload pending logs:', error)
    } finally {
      this.isUploading = false
    }
  }

  async forceUpload(): Promise<void> {
    await this.uploadPendingLogs()
  }

  destroy(): void {
    this.idleDetector.destroy()
  }
}
