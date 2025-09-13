# Configuration

The Logger utility provides extensive configuration options to customize its behavior for your specific needs.

## Configuration Interface

```typescript
interface LoggerConfig {
  serverUrl?: string // Server URL for log upload
  debugMode?: boolean // Enable/disable debug console output
  uploadLogs?: boolean // Enable/disable server upload
  logExpiration?: number // Log expiration in days
  uploadStrategy?: 'idle' | 'immediate' // Upload timing strategy
  batchSize?: number // Batch size for idle uploads
}
```

## Default Configuration

```typescript
const DEFAULT_CONFIG = {
  serverUrl: '', // No server URL (upload disabled)
  debugMode: true, // Debug mode enabled
  uploadLogs: true, // Upload enabled (if serverUrl provided)
  logExpiration: 3, // 3 days expiration
  uploadStrategy: 'idle', // Idle upload strategy
  batchSize: 50, // 50 logs per batch
}
```

## Configuration Options

### Server URL

Configure where logs should be uploaded:

```typescript
const logger = new Logger({
  serverUrl: 'https://api.example.com/logs',
})
```

**Expected Server Format:**

```json
{
  "logs": [
    {
      "id": "unique-id",
      "level": "info",
      "title": "Log title",
      "data": { "key": "value" },
      "timestamp": 1672531200000
    }
  ],
  "uploadTime": 1672531201000
}
```

### Debug Mode

Control console output behavior:

**Debug Mode Enabled (Default):**

```typescript
const logger = new Logger({ debugMode: true })

await logger.debug('Debug message') // ✅ Printed to console
await logger.trace('Trace message') // ✅ Printed to console
await logger.info('Info message') // ✅ Printed to console
```

**Debug Mode Disabled:**

```typescript
const logger = new Logger({ debugMode: false })

await logger.debug('Debug message') // ❌ Not printed (but stored)
await logger.trace('Trace message') // ❌ Not printed (but stored)
await logger.info('Info message') // ✅ Printed to console
await logger.warn('Warning message') // ✅ Printed to console
await logger.error('Error message') // ✅ Printed to console
```

### Upload Logs

Enable or disable server uploads:

```typescript
// Enable uploads (requires serverUrl)
const logger = new Logger({
  uploadLogs: true,
  serverUrl: 'https://api.example.com/logs',
})

// Disable uploads (local storage only)
const logger = new Logger({
  uploadLogs: false,
})
```

### Log Expiration

Set how long logs are kept in local storage:

```typescript
// Keep logs for 1 week
const logger = new Logger({
  logExpiration: 7,
})

// Keep logs for 1 month
const logger = new Logger({
  logExpiration: 30,
})

// Disable expiration (keep logs forever)
const logger = new Logger({
  logExpiration: 0,
})
```

### Upload Strategy

Choose when logs are uploaded to the server:

**Idle Upload (Default):**

```typescript
const logger = new Logger({
  uploadStrategy: 'idle',
  batchSize: 100, // Upload 100 logs at a time
})
```

- Uploads during browser idle periods
- Batches multiple logs together
- More efficient for high-volume logging

**Immediate Upload:**

```typescript
const logger = new Logger({
  uploadStrategy: 'immediate',
})
```

- Uploads each log immediately
- Real-time log delivery
- Higher network overhead

### Batch Size

Control how many logs are uploaded together (idle strategy only):

```typescript
const logger = new Logger({
  uploadStrategy: 'idle',
  batchSize: 25, // Smaller batches, more frequent uploads
})

const logger = new Logger({
  uploadStrategy: 'idle',
  batchSize: 200, // Larger batches, less frequent uploads
})
```

## Environment-Based Configuration

### Development Configuration

```typescript
const developmentConfig: LoggerConfig = {
  debugMode: true, // Show all logs in console
  uploadLogs: false, // Don't upload in development
  logExpiration: 1, // Clean up daily
}

const logger = new Logger(developmentConfig)
```

### Production Configuration

```typescript
const productionConfig: LoggerConfig = {
  serverUrl: 'https://logs.yourapp.com/api/logs',
  debugMode: false, // Only show important logs
  uploadLogs: true, // Upload to server
  uploadStrategy: 'idle', // Efficient batching
  logExpiration: 7, // Keep logs for a week
  batchSize: 100,
}

const logger = new Logger(productionConfig)
```

### Testing Configuration

```typescript
const testConfig: LoggerConfig = {
  debugMode: false, // Quiet console during tests
  uploadLogs: false, // No network requests
  logExpiration: 0, // Clean up immediately
}

const logger = new Logger(testConfig)
```

## Dynamic Configuration Updates

You can update configuration after initialization:

```typescript
const logger = new Logger()
await logger.init()

// Update configuration at runtime
await logger.updateConfig({
  debugMode: false,
  uploadStrategy: 'immediate',
})

// Get current configuration
const currentConfig = await logger.getConfig()
console.log(currentConfig)
```

## Configuration Validation

The logger validates configuration and provides helpful warnings:

```typescript
// Invalid configuration example
const logger = new Logger({
  uploadLogs: true, // Upload enabled
  serverUrl: '', // But no server URL provided
})

// Console warning: "Upload enabled but no server URL configured"
```

## Best Practices

### 1. Environment-Specific Configuration

```typescript
const config: LoggerConfig = {
  debugMode: process.env.NODE_ENV === 'development',
  serverUrl: process.env.LOG_SERVER_URL,
  uploadLogs: process.env.NODE_ENV === 'production',
  logExpiration: process.env.NODE_ENV === 'production' ? 7 : 1,
}
```

### 2. Conditional Upload Strategy

```typescript
const config: LoggerConfig = {
  uploadStrategy: process.env.REAL_TIME_LOGS === 'true' ? 'immediate' : 'idle',
  batchSize: process.env.NODE_ENV === 'production' ? 100 : 10,
}
```

### 3. Configuration Factory

```typescript
function createLoggerConfig(environment: string): LoggerConfig {
  const baseConfig: LoggerConfig = {
    logExpiration: 3,
    batchSize: 50,
  }

  switch (environment) {
    case 'development':
      return {
        ...baseConfig,
        debugMode: true,
        uploadLogs: false,
      }

    case 'staging':
      return {
        ...baseConfig,
        debugMode: true,
        uploadLogs: true,
        serverUrl: 'https://staging-logs.example.com',
      }

    case 'production':
      return {
        ...baseConfig,
        debugMode: false,
        uploadLogs: true,
        serverUrl: 'https://logs.example.com',
        uploadStrategy: 'idle',
      }

    default:
      return baseConfig
  }
}

const logger = new Logger(createLoggerConfig(process.env.NODE_ENV))
```

## Configuration Examples

### High-Performance Setup

```typescript
const highPerformanceConfig: LoggerConfig = {
  debugMode: false, // Minimal console output
  uploadStrategy: 'idle', // Batch processing
  batchSize: 200, // Large batches
  logExpiration: 1, // Quick cleanup
}
```

### Real-Time Monitoring Setup

```typescript
const realTimeConfig: LoggerConfig = {
  serverUrl: 'https://realtime-logs.example.com',
  uploadStrategy: 'immediate', // Instant upload
  debugMode: true, // Full visibility
  logExpiration: 30, // Long retention
}
```

### Minimal Storage Setup

```typescript
const minimalConfig: LoggerConfig = {
  uploadLogs: false, // No uploads
  logExpiration: 0, // No persistence
  debugMode: true, // Console only
}
```

## Next Steps

- [Upload Strategies](./upload-strategies.md) - Deep dive into upload options
- [Storage Management](./storage.md) - Understanding local storage behavior
- [API Reference](../api/index.md) - Complete method documentation
