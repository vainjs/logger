import { Logger } from '../core/logger'
import { LoggerConfig } from '../types'

// Mock IndexedDB
class MockIDBRequest {
  result: any
  onerror: ((event: Event) => void) | null = null
  onsuccess: ((event: Event) => void) | null = null

  constructor(result?: any) {
    this.result = result
    // Simulate async success
    setTimeout(() => {
      if (this.onsuccess) {
        this.onsuccess({} as Event)
      }
    }, 0)
  }
}

class MockIDBDatabase {
  objectStoreNames = { contains: jest.fn(() => false) }
  transaction = jest.fn(() => new MockIDBTransaction())
  createObjectStore = jest.fn(() => new MockIDBObjectStore())
}

class MockIDBTransaction {
  objectStore = jest.fn(() => new MockIDBObjectStore())
}

class MockIDBObjectStore {
  add = jest.fn(() => new MockIDBRequest())
  put = jest.fn(() => new MockIDBRequest())
  get = jest.fn(() => new MockIDBRequest({}))
  getAll = jest.fn(() => new MockIDBRequest([]))
  clear = jest.fn(() => new MockIDBRequest())
  createIndex = jest.fn()
  index = jest.fn(() => ({
    getAll: jest.fn(() => new MockIDBRequest([])),
    openCursor: jest.fn(() => new MockIDBRequest()),
  }))
  openCursor = jest.fn(() => new MockIDBRequest())
  delete = jest.fn(() => new MockIDBRequest())
}

// Mock global IndexedDB
;(global as any).indexedDB = {
  open: jest.fn(() => {
    const request = new MockIDBRequest()
    request.result = new MockIDBDatabase()
    // Trigger onupgradeneeded for first time setup
    setTimeout(() => {
      if ((request as any).onupgradeneeded) {
        ;(request as any).onupgradeneeded({ target: request })
      }
    }, 0)
    return request
  }),
}

// Mock fetch
;(global as any).fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve({}),
  })
)

describe('Logger', () => {
  let logger: Logger

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()
    jest.spyOn(console, 'warn').mockImplementation()
    jest.spyOn(console, 'debug').mockImplementation()
    jest.spyOn(console, 'trace').mockImplementation()
  })

  afterEach(async () => {
    if (logger) {
      logger.destroy()
    }
    jest.restoreAllMocks()
  })

  describe('Initialization', () => {
    it('should create logger with default config', () => {
      logger = new Logger()
      expect(logger).toBeInstanceOf(Logger)
    })

    it('should create logger with custom config', () => {
      const config: LoggerConfig = {
        debugMode: false,
        serverUrl: 'https://api.example.com/logs',
        uploadStrategy: 'immediate',
      }
      logger = new Logger(config)
      expect(logger).toBeInstanceOf(Logger)
    })

    it('should initialize logger successfully', async () => {
      logger = new Logger()
      await expect(logger.init()).resolves.not.toThrow()
    })
  })

  describe('Logging Methods', () => {
    beforeEach(async () => {
      logger = new Logger({ debugMode: true })
      await logger.init()
    })

    it('should log info messages', async () => {
      await logger.info('Test info', { key: 'value' })
      expect(console.log).toHaveBeenCalled()
    })

    it('should log warn messages', async () => {
      await logger.warn('Test warning', { key: 'value' })
      expect(console.warn).toHaveBeenCalled()
    })

    it('should log error messages', async () => {
      await logger.error('Test error', { key: 'value' })
      expect(console.error).toHaveBeenCalled()
    })

    it('should log debug messages in debug mode', async () => {
      await logger.debug('Test debug', { key: 'value' })
      expect(console.debug).toHaveBeenCalled()
    })

    it('should log trace messages in debug mode', async () => {
      await logger.trace('Test trace', { key: 'value' })
      expect(console.trace).toHaveBeenCalled()
    })
  })

  describe('Debug Mode', () => {
    it('should not log debug/trace in non-debug mode', async () => {
      logger = new Logger({ debugMode: false })
      await logger.init()

      await logger.debug('Test debug', {})
      await logger.trace('Test trace', {})

      expect(console.debug).not.toHaveBeenCalled()
      expect(console.trace).not.toHaveBeenCalled()
    })

    it('should still log info/warn/error in non-debug mode', async () => {
      logger = new Logger({ debugMode: false })
      await logger.init()

      await logger.info('Test info', {})
      await logger.warn('Test warn', {})
      await logger.error('Test error', {})

      expect(console.log).toHaveBeenCalled()
      expect(console.warn).toHaveBeenCalled()
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('Configuration', () => {
    beforeEach(async () => {
      logger = new Logger()
      await logger.init()
    })

    it('should get current config', async () => {
      const config = await logger.getConfig()
      expect(config).toHaveProperty('debugMode')
      expect(config).toHaveProperty('serverUrl')
      expect(config).toHaveProperty('uploadStrategy')
    })

    it('should update config', async () => {
      await logger.updateConfig({ debugMode: false })
      const config = await logger.getConfig()
      expect(config.debugMode).toBe(false)
    })
  })

  describe('Utility Methods', () => {
    beforeEach(async () => {
      logger = new Logger()
      await logger.init()
    })

    it('should force upload logs', async () => {
      await expect(logger.forceUpload()).resolves.not.toThrow()
    })

    it('should get all logs', async () => {
      const logs = await logger.getAllLogs()
      expect(Array.isArray(logs)).toBe(true)
    })

    it('should clear all logs', async () => {
      await expect(logger.clearAllLogs()).resolves.not.toThrow()
    })
  })
})
