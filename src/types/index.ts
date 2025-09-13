export type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'trace'

export type UploadStrategy = 'idle' | 'immediate'

export interface LoggerConfig {
  /** Server URL for uploading logs */
  serverUrl?: string
  /** Enable debug mode (default: true) */
  debugMode?: boolean
  /** Enable uploading logs to server (default: true) */
  uploadLogs?: boolean
  /** Log expiration time in days (default: 3) */
  logExpiration?: number
  /** Upload strategy: 'idle' or 'immediate' (default: 'idle') */
  uploadStrategy?: UploadStrategy
  /** Batch size for idle upload (default: 50) */
  batchSize?: number
}

export interface LogEntry {
  /** Unique identifier for the log entry */
  id: string
  /** Log level */
  level: LogLevel
  /** Log title */
  title: string
  /** Log data */
  data: Record<string, any>
  /** Timestamp when log was created */
  timestamp: number
  /** Whether this log has been uploaded */
  uploaded?: boolean
}

export interface StorageInterface {
  /** Initialize the storage */
  init(): Promise<void>
  /** Save a log entry */
  saveLog(log: LogEntry): Promise<void>
  /** Get logs that haven't been uploaded */
  getUnuploadedLogs(): Promise<LogEntry[]>
  /** Mark logs as uploaded */
  markAsUploaded(logIds: string[]): Promise<void>
  /** Clean up expired logs */
  cleanupExpiredLogs(expirationDays: number): Promise<void>
  /** Get all logs (for debugging) */
  getAllLogs(): Promise<LogEntry[]>
  /** Clear all logs */
  clearAllLogs(): Promise<void>
}

export interface UploaderInterface {
  /** Upload logs to server */
  uploadLogs(logs: LogEntry[]): Promise<boolean>
}
