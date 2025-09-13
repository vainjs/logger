# Getting Started

Welcome to the Logger utility! This guide will help you get up and running quickly with logging in your application.

## Basic Setup

### 1. Import and Initialize

```typescript
import { Logger } from '@vainjs/logger'

// Create logger instance with default configuration
const logger = new Logger()

// Initialize the logger (required)
await logger.init()
```

### 2. Start Logging

```typescript
// Log different levels of messages
await logger.info('Application started', {
  version: '1.0.0',
  timestamp: Date.now(),
})

await logger.warn('Performance warning', {
  loadTime: 2000,
  threshold: 1000,
})

await logger.error('Request failed', {
  error: 'Network timeout',
  url: 'https://api.example.com/data',
  code: 500,
})

await logger.debug('Debug information', {
  variable: 'value',
  state: 'processing',
})

await logger.trace('Function execution', {
  function: 'processUserData',
  args: [1, 2, 3],
})
```

## Method Signature

All logging methods follow the same pattern:

```typescript
await logger.{level}(title: string, data: Record<string, any>)
```

- **title**: A descriptive string for the log entry
- **data**: An object containing additional context information

## Debug Mode Behavior

The logger has two modes that affect console output:

### Debug Mode ON (Default)

```typescript
const logger = new Logger({ debugMode: true })
await logger.debug('This will appear in console')
await logger.trace('This will also appear in console')
```

### Debug Mode OFF (Production)

```typescript
const logger = new Logger({ debugMode: false })
await logger.debug('This will NOT appear in console but will be stored')
await logger.info('This will appear in console')
```

## Understanding Log Storage

All logs are automatically stored locally using IndexedDB, regardless of console output:

```typescript
// Get all stored logs
const logs = await logger.getAllLogs()
console.log(`Total logs stored: ${logs.length}`)

// Clear stored logs
await logger.clearAllLogs()
```

## Basic Configuration

You can customize the logger behavior:

```typescript
import { Logger, LoggerConfig } from '@vainjs/logger'

const config: LoggerConfig = {
  debugMode: false, // Disable debug console output
  logExpiration: 7, // Keep logs for 7 days
  uploadLogs: true, // Enable server upload
  uploadStrategy: 'immediate', // Upload logs immediately
}

const logger = new Logger(config)
await logger.init()
```

## Upload Configuration

### Immediate Upload

```typescript
const logger = new Logger({
  serverUrl: 'https://api.example.com/logs',
  uploadStrategy: 'immediate',
  uploadLogs: true,
})
```

### Idle Upload (Default)

```typescript
const logger = new Logger({
  serverUrl: 'https://api.example.com/logs',
  uploadStrategy: 'idle',
  batchSize: 50, // Upload 50 logs per batch
  uploadLogs: true,
})
```

## Error Handling

The logger handles errors gracefully:

```typescript
try {
  await logger.info('This might fail', { data: 'example' })
} catch (error) {
  console.error('Logging failed:', error)
}

// Logger continues to work even if upload fails
await logger.error('Upload failed but local storage works', {
  error: 'Network unavailable',
})
```

## Cleanup

When you're done with the logger:

```typescript
// Force upload any pending logs
await logger.forceUpload()

// Clean up resources
logger.destroy()
```

## Complete Example

Here's a complete working example:

```typescript
import { Logger } from '@vainjs/logger'

async function setupLogging() {
  // Initialize logger
  const logger = new Logger({
    serverUrl: 'https://api.example.com/logs',
    debugMode: process.env.NODE_ENV === 'development',
    uploadStrategy: 'idle',
    logExpiration: 3,
  })

  await logger.init()

  // Log application startup
  await logger.info('Application initialized', {
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    timestamp: Date.now(),
  })

  // Simulate some application activity
  try {
    // Your application logic here
    await logger.debug('Processing user request', { userId: 123 })

    // Simulate an error
    throw new Error('Something went wrong')
  } catch (error) {
    await logger.error('Application error', {
      error: error.message,
      stack: error.stack,
      timestamp: Date.now(),
    })
  }

  // Cleanup on application exit
  process.on('beforeExit', () => {
    logger.destroy()
  })

  return logger
}

// Use the logger
setupLogging().then((logger) => {
  console.log('Logger is ready!')
})
```

## Next Steps

- [Configuration Guide](./configuration.md) - Learn about all configuration options
- [Upload Strategies](./upload-strategies.md) - Understand different upload approaches
- [API Reference](../api/index.md) - Complete API documentation
- [Examples](../examples/index.md) - More real-world examples
