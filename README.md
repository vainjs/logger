# @vainjs/logger

English | [简体中文](./README-zh_CN.md)

📖 **[Documentation](https://vainjs.github.io/logger/)** | 🚀 **[Quick Start](#basic-usage)**

A fully-featured logging solution with local storage and smart upload strategies.

## Features

✅ **Logging Methods**: Provides `info`, `warn`, `error`, `debug`, `trace` methods  
✅ **Flexible Configuration**: Configure log expiration, server URL, debug mode, upload strategies, etc.  
✅ **Debug Mode**: Enabled by default, prints all logs in debug mode, only info/warn/error in production  
✅ **Local Storage**: Uses IndexedDB for local log persistence with 3-day default expiration  
✅ **Smart Upload**: Supports idle-time batch upload and immediate upload strategies  
✅ **Auto Cleanup**: Automatically removes oldest logs when storage space is insufficient

## Installation

```bash
npm install @vainjs/logger
```

## Basic Usage

```typescript
import { Logger } from '@vainjs/logger'

// Use default configuration
const logger = new Logger()

// Initialize (async)
await logger.init()

// Log messages
await logger.info('User login', { userId: 123, timestamp: Date.now() })
await logger.warn('Performance warning', { loadTime: 2000 })
await logger.error('Request failed', { error: 'Network timeout', code: 500 })
await logger.debug('Debug information', { variable: 'value' })
await logger.trace('Trace information', { stack: 'trace' })
```

## Advanced Configuration

```typescript
import { Logger, LoggerConfig } from '@vainjs/logger'

const config: LoggerConfig = {
  serverUrl: 'https://api.example.com/logs', // Server URL
  debugMode: false, // Disable debug mode
  uploadLogs: true, // Enable log upload
  logExpiration: 7, // Keep logs for 7 days
  uploadStrategy: 'immediate', // Immediate upload strategy
  batchSize: 100, // Batch upload size
}

const logger = new Logger(config)
await logger.init()
```

## Upload Strategies

### 1. Idle Upload (Default)

```typescript
const logger = new Logger({
  uploadStrategy: 'idle', // Batch upload during browser idle time
  batchSize: 50, // Upload 50 logs per batch
})
```

### 2. Immediate Upload

```typescript
const logger = new Logger({
  uploadStrategy: 'immediate', // Upload each log immediately
})
```

## Utility Methods

```typescript
// Force upload all pending logs
await logger.forceUpload()

// Get all local logs
const logs = await logger.getAllLogs()
console.log('Local log count:', logs.length)

// Clear all local logs
await logger.clearAllLogs()

// Get current configuration
const currentConfig = await logger.getConfig()

// Update configuration
await logger.updateConfig({ debugMode: false })

// Destroy logger instance
logger.destroy()
```

## Debug Mode

- **Debug Mode ON** (default): Prints all log levels to console
- **Debug Mode OFF**: Only prints `info`, `warn`, `error` logs; `debug` and `trace` are stored but not printed

```typescript
// Debug mode enabled
const debugLogger = new Logger({ debugMode: true })
await debugLogger.debug('This will be printed to console')

// Debug mode disabled
const prodLogger = new Logger({ debugMode: false })
await prodLogger.debug('This will not be printed but will be stored')
await prodLogger.info('This will be printed to console')
```

## Server API Format

When `serverUrl` is configured, logs are sent to the server via POST request:

```json
{
  "logs": [
    {
      "id": "1672531200000-abc123",
      "level": "info",
      "title": "User login",
      "data": { "userId": 123 },
      "timestamp": 1672531200000
    }
  ],
  "uploadTime": 1672531201000
}
```

## Browser Compatibility

- Supports all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires IndexedDB support
- Requires ES2020+ support

## Type Definitions

```typescript
interface LoggerConfig {
  serverUrl?: string // Server URL
  debugMode?: boolean // Debug mode (default: true)
  uploadLogs?: boolean // Enable log upload (default: true)
  logExpiration?: number // Log expiration in days (default: 3)
  uploadStrategy?: 'idle' | 'immediate' // Upload strategy (default: 'idle')
  batchSize?: number // Batch upload size (default: 50)
}

type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'trace'
```

## Development

```bash
# Install dependencies
pnpm install

# Build project
npm run build

# Development mode (watch for changes)
npm run dev

# Run tests
npm test

# Clean build files
npm run clean
```

## License

MIT
