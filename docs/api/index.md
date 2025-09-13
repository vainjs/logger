# API Reference

Complete API documentation for the Logger utility.

## Logger Class

### Constructor

```typescript
new Logger(config?: LoggerConfig)
```

Creates a new Logger instance with optional configuration.

**Parameters:**

- `config` (optional): Configuration object to customize logger behavior

**Example:**

```typescript
const logger = new Logger({
  debugMode: true,
  serverUrl: 'https://api.example.com/logs',
})
```

### Methods

#### init()

```typescript
async init(): Promise<void>
```

Initializes the logger and sets up storage. Must be called before using logging methods.

**Returns:** Promise that resolves when initialization is complete

**Example:**

```typescript
const logger = new Logger()
await logger.init()
```

#### info()

```typescript
async info(title: string, data: Record<string, any> = {}): Promise<void>
```

Logs an informational message.

**Parameters:**

- `title`: Descriptive title for the log entry
- `data`: Additional context data (optional)

**Example:**

```typescript
await logger.info('User login', { userId: 123, timestamp: Date.now() })
```

#### warn()

```typescript
async warn(title: string, data: Record<string, any> = {}): Promise<void>
```

Logs a warning message.

**Parameters:**

- `title`: Descriptive title for the log entry
- `data`: Additional context data (optional)

**Example:**

```typescript
await logger.warn('High memory usage', { usage: '85%', threshold: '80%' })
```

#### error()

```typescript
async error(title: string, data: Record<string, any> = {}): Promise<void>
```

Logs an error message.

**Parameters:**

- `title`: Descriptive title for the log entry
- `data`: Additional context data (optional)

**Example:**

```typescript
await logger.error('Database connection failed', {
  error: 'Connection timeout',
  database: 'users_db',
})
```

#### debug()

```typescript
async debug(title: string, data: Record<string, any> = {}): Promise<void>
```

Logs a debug message. Only printed to console when `debugMode` is enabled.

**Parameters:**

- `title`: Descriptive title for the log entry
- `data`: Additional context data (optional)

**Example:**

```typescript
await logger.debug('Processing user data', { userId: 123, step: 'validation' })
```

#### trace()

```typescript
async trace(title: string, data: Record<string, any> = {}): Promise<void>
```

Logs a trace message. Only printed to console when `debugMode` is enabled.

**Parameters:**

- `title`: Descriptive title for the log entry
- `data`: Additional context data (optional)

**Example:**

```typescript
await logger.trace('Function entry', { function: 'processPayment', args: [orderId] })
```

#### forceUpload()

```typescript
async forceUpload(): Promise<void>
```

Forces immediate upload of all pending logs, regardless of upload strategy.

**Example:**

```typescript
await logger.forceUpload()
```

#### getAllLogs()

```typescript
async getAllLogs(): Promise<LogEntry[]>
```

Retrieves all logs stored locally.

**Returns:** Array of log entries

**Example:**

```typescript
const logs = await logger.getAllLogs()
console.log(`Total logs: ${logs.length}`)
```

#### clearAllLogs()

```typescript
async clearAllLogs(): Promise<void>
```

Removes all logs from local storage.

**Example:**

```typescript
await logger.clearAllLogs()
```

#### getConfig()

```typescript
async getConfig(): Promise<Required<LoggerConfig>>
```

Returns the current logger configuration.

**Returns:** Current configuration object

**Example:**

```typescript
const config = await logger.getConfig()
console.log('Debug mode:', config.debugMode)
```

#### updateConfig()

```typescript
async updateConfig(newConfig: Partial<LoggerConfig>): Promise<void>
```

Updates the logger configuration at runtime.

**Parameters:**

- `newConfig`: Partial configuration object with properties to update

**Example:**

```typescript
await logger.updateConfig({
  debugMode: false,
  uploadStrategy: 'immediate',
})
```

#### destroy()

```typescript
destroy(): void
```

Cleans up resources and stops all background processes. Call when done with the logger.

**Example:**

```typescript
logger.destroy()
```

## Type Definitions

### LoggerConfig

```typescript
interface LoggerConfig {
  serverUrl?: string // Server URL for log upload
  debugMode?: boolean // Enable debug console output (default: true)
  uploadLogs?: boolean // Enable server upload (default: true)
  logExpiration?: number // Log expiration in days (default: 3)
  uploadStrategy?: UploadStrategy // Upload timing (default: 'idle')
  batchSize?: number // Batch size for uploads (default: 50)
}
```

### LogEntry

```typescript
interface LogEntry {
  id: string // Unique identifier
  level: LogLevel // Log level
  title: string // Log title
  data: Record<string, any> // Additional data
  timestamp: number // Creation timestamp
  uploaded?: boolean // Upload status
}
```

### LogLevel

```typescript
type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'trace'
```

### UploadStrategy

```typescript
type UploadStrategy = 'idle' | 'immediate'
```

## Default Configuration

```typescript
const DEFAULT_CONFIG: Required<LoggerConfig> = {
  serverUrl: '',
  debugMode: true,
  uploadLogs: true,
  logExpiration: 3,
  uploadStrategy: 'idle',
  batchSize: 50,
}
```

## Error Handling

All logger methods handle errors gracefully and will not throw exceptions under normal circumstances. Errors are logged to the console for debugging purposes.

### Common Error Scenarios

1. **Storage Initialization Failure**: Logger continues to work with console-only output
2. **Upload Failures**: Logs remain in local storage for retry
3. **Invalid Configuration**: Default values are used with console warnings

### Error Examples

```typescript
// Logger handles storage errors gracefully
const logger = new Logger()
try {
  await logger.init()
} catch (error) {
  console.error('Logger initialization failed:', error)
  // Logger still works, just without storage
}

// Upload errors don't affect logging
await logger.info('This will be logged even if upload fails')
```

## Browser Compatibility

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Required APIs**: IndexedDB, ES2020 features, fetch API
- **Optional Features**: Performance API (for timing), Memory API (for monitoring)

## Performance Considerations

- **Memory Usage**: Logs are stored efficiently in IndexedDB
- **CPU Impact**: Minimal overhead for log creation and storage
- **Network Usage**: Configurable batch sizes minimize network requests
- **Storage Cleanup**: Automatic cleanup prevents storage overflow

## Thread Safety

The logger is designed for single-threaded browser environments. All operations are async and properly queued to prevent race conditions.

## Migration Guide

### From Console Logging

```typescript
// Before
console.log('User action', { userId: 123 })
console.error('Something failed', error)

// After
await logger.info('User action', { userId: 123 })
await logger.error('Something failed', { error: error.message })
```

### From Other Logging Libraries

```typescript
// Winston-style
logger.info('message', { meta: 'data' })

// Logger utility style
await logger.info('message', { meta: 'data' })
```

## Best Practices

1. **Always Initialize**: Call `init()` before logging
2. **Use Appropriate Levels**: Choose the right log level for each message
3. **Include Context**: Add relevant data to log entries
4. **Handle Cleanup**: Call `destroy()` when done
5. **Configure for Environment**: Use different configs for dev/prod

## Examples

See the [Examples](../examples/) section for comprehensive usage examples and integration patterns.
