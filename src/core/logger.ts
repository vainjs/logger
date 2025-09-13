import { LogLevel, LogEntry, LoggerConfig } from '../types'
import { mergeConfig } from '../types/config'
import { IndexedDBStorage } from '../storage/indexedDB'
import { LogUploader } from '../uploader/uploader'
import { UploadManager } from '../uploader/uploadManager'
import { CleanupManager } from '../utils/cleanup'
import { generateLogId, getCurrentTimestamp } from '../utils/helpers'

export class Logger {
  private config: Required<LoggerConfig>
  private storage: IndexedDBStorage
  private uploader: LogUploader
  private uploadManager: UploadManager
  private cleanupManager: CleanupManager
  private initialized = false

  constructor(config: LoggerConfig = {}) {
    this.config = mergeConfig(config)
    this.storage = new IndexedDBStorage()
    this.uploader = new LogUploader(this.config.serverUrl)
    this.uploadManager = new UploadManager(
      this.storage,
      this.uploader,
      this.config.uploadStrategy,
      this.config.batchSize
    )
    this.cleanupManager = new CleanupManager(this.storage)
  }

  async init(): Promise<void> {
    if (this.initialized) {
      return
    }

    try {
      await this.storage.init()

      // Start cleanup if enabled
      if (this.config.logExpiration > 0) {
        this.cleanupManager.startPeriodicCleanup(this.config.logExpiration)
      }

      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize logger:', error)
      throw error
    }
  }

  private async log(level: LogLevel, title: string, data: Record<string, any>): Promise<void> {
    if (!this.initialized) {
      await this.init()
    }

    // Check if we should log this level in non-debug mode
    if (!this.config.debugMode && (level === 'debug' || level === 'trace')) {
      return
    }

    const logEntry: LogEntry = {
      id: generateLogId(),
      level,
      title,
      data,
      timestamp: getCurrentTimestamp(),
      uploaded: false,
    }

    // Always print to console in debug mode
    if (this.config.debugMode) {
      this.printToConsole(logEntry)
    } else if (level !== 'debug' && level !== 'trace') {
      // In non-debug mode, only print info, warn, error
      this.printToConsole(logEntry)
    }

    try {
      // Handle storage and upload
      if (this.config.uploadLogs) {
        await this.uploadManager.handleNewLog(logEntry)
      } else {
        // If upload is disabled, just save to storage
        await this.storage.saveLog(logEntry)
      }
    } catch (error) {
      console.error('Failed to process log entry:', error)
    }
  }

  private printToConsole(log: LogEntry): void {
    const timestamp = new Date(log.timestamp).toISOString()
    const message = `[${timestamp}] [${log.level.toUpperCase()}] ${log.title}`

    switch (log.level) {
      case 'error':
        console.error(message, log.data)
        break
      case 'warn':
        console.warn(message, log.data)
        break
      case 'debug':
        console.debug(message, log.data)
        break
      case 'trace':
        console.trace(message, log.data)
        break
      case 'info':
      default:
        console.log(message, log.data)
        break
    }
  }

  // Public logging methods
  async info(title: string, data: Record<string, any> = {}): Promise<void> {
    await this.log('info', title, data)
  }

  async warn(title: string, data: Record<string, any> = {}): Promise<void> {
    await this.log('warn', title, data)
  }

  async error(title: string, data: Record<string, any> = {}): Promise<void> {
    await this.log('error', title, data)
  }

  async debug(title: string, data: Record<string, any> = {}): Promise<void> {
    await this.log('debug', title, data)
  }

  async trace(title: string, data: Record<string, any> = {}): Promise<void> {
    await this.log('trace', title, data)
  }

  // Utility methods
  async forceUpload(): Promise<void> {
    if (!this.initialized) {
      await this.init()
    }
    await this.uploadManager.forceUpload()
  }

  async getAllLogs(): Promise<LogEntry[]> {
    if (!this.initialized) {
      await this.init()
    }
    return await this.storage.getAllLogs()
  }

  async clearAllLogs(): Promise<void> {
    if (!this.initialized) {
      await this.init()
    }
    await this.storage.clearAllLogs()
  }

  async getConfig(): Promise<Required<LoggerConfig>> {
    return { ...this.config }
  }

  async updateConfig(newConfig: Partial<LoggerConfig>): Promise<void> {
    const oldConfig = this.config
    this.config = mergeConfig({ ...this.config, ...newConfig })

    // Recreate components if necessary
    if (oldConfig.serverUrl !== this.config.serverUrl) {
      this.uploader = new LogUploader(this.config.serverUrl)
    }

    if (oldConfig.uploadStrategy !== this.config.uploadStrategy || oldConfig.batchSize !== this.config.batchSize) {
      this.uploadManager.destroy()
      this.uploadManager = new UploadManager(
        this.storage,
        this.uploader,
        this.config.uploadStrategy,
        this.config.batchSize
      )
    }

    if (oldConfig.logExpiration !== this.config.logExpiration) {
      this.cleanupManager.stopPeriodicCleanup()
      if (this.config.logExpiration > 0) {
        this.cleanupManager.startPeriodicCleanup(this.config.logExpiration)
      }
    }
  }

  destroy(): void {
    this.uploadManager.destroy()
    this.cleanupManager.destroy()
    this.initialized = false
  }
}
