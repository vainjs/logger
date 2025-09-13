import { LogEntry, StorageInterface } from '../types'

export class IndexedDBStorage implements StorageInterface {
  private db: IDBDatabase | null = null
  private readonly dbName = 'LoggerDB'
  private readonly dbVersion = 1
  private readonly storeName = 'logs'

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object store for logs
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('uploaded', 'uploaded', { unique: false })
          store.createIndex('level', 'level', { unique: false })
        }
      }
    })
  }

  async saveLog(log: LogEntry): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.add(log)

      request.onerror = () => {
        reject(new Error('Failed to save log'))
      }

      request.onsuccess = () => {
        resolve()
      }
    })
  }

  async getUnuploadedLogs(): Promise<LogEntry[]> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.getAll()

      request.onerror = () => {
        reject(new Error('Failed to get unuploaded logs'))
      }

      request.onsuccess = () => {
        const allLogs = request.result || []
        const unuploadedLogs = allLogs.filter((log) => !log.uploaded)
        resolve(unuploadedLogs)
      }
    })
  }

  async markAsUploaded(logIds: string[]): Promise<void> {
    if (!this.db || logIds.length === 0) {
      return
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      let completed = 0
      let hasError = false

      logIds.forEach((id) => {
        const getRequest = store.get(id)
        getRequest.onsuccess = () => {
          const log = getRequest.result
          if (log) {
            log.uploaded = true
            const updateRequest = store.put(log)
            updateRequest.onsuccess = () => {
              completed++
              if (completed === logIds.length && !hasError) {
                resolve()
              }
            }
            updateRequest.onerror = () => {
              hasError = true
              reject(new Error(`Failed to mark log ${id} as uploaded`))
            }
          } else {
            completed++
            if (completed === logIds.length && !hasError) {
              resolve()
            }
          }
        }
        getRequest.onerror = () => {
          hasError = true
          reject(new Error(`Failed to get log ${id}`))
        }
      })
    })
  }

  async cleanupExpiredLogs(expirationDays: number): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    const expirationTime = Date.now() - expirationDays * 24 * 60 * 60 * 1000

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const index = store.index('timestamp')
      const range = IDBKeyRange.upperBound(expirationTime)
      const request = index.openCursor(range)

      request.onerror = () => {
        reject(new Error('Failed to cleanup expired logs'))
      }

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        } else {
          resolve()
        }
      }
    })
  }

  async getAllLogs(): Promise<LogEntry[]> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.getAll()

      request.onerror = () => {
        reject(new Error('Failed to get all logs'))
      }

      request.onsuccess = () => {
        resolve(request.result || [])
      }
    })
  }

  async clearAllLogs(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.clear()

      request.onerror = () => {
        reject(new Error('Failed to clear all logs'))
      }

      request.onsuccess = () => {
        resolve()
      }
    })
  }
}
