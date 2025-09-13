# Basic Usage Examples

This section provides practical examples of using the Logger utility in different scenarios.

## Simple Console Logging

The most basic usage - just log to console and local storage:

```typescript
import { Logger } from '@vainjs/logger'

async function basicExample() {
  const logger = new Logger()
  await logger.init()

  // Simple logging
  await logger.info('Application started')
  await logger.warn('This is a warning')
  await logger.error('Something went wrong')

  // With additional data
  await logger.info('User action', {
    userId: 123,
    action: 'login',
    timestamp: Date.now(),
  })
}

basicExample()
```

## Web Application Example

Typical setup for a web application:

```typescript
import { Logger } from '@vainjs/logger'

class WebApp {
  private logger: Logger

  constructor() {
    this.logger = new Logger({
      debugMode: process.env.NODE_ENV === 'development',
      serverUrl: 'https://api.example.com/logs',
      uploadStrategy: 'idle',
      logExpiration: 7,
    })
  }

  async initialize() {
    await this.logger.init()

    await this.logger.info('Web application initialized', {
      version: '1.2.3',
      environment: process.env.NODE_ENV,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    })
  }

  async handleUserLogin(userId: string) {
    await this.logger.info('User login attempt', { userId })

    try {
      // Your login logic here
      const result = await this.authenticateUser(userId)

      await this.logger.info('User login successful', {
        userId,
        sessionId: result.sessionId,
        loginTime: Date.now(),
      })

      return result
    } catch (error) {
      await this.logger.error('User login failed', {
        userId,
        error: error.message,
        timestamp: Date.now(),
      })
      throw error
    }
  }

  async handleApiCall(endpoint: string, data: any) {
    const startTime = Date.now()

    await this.logger.debug('API call started', {
      endpoint,
      requestData: data,
      timestamp: startTime,
    })

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()
      const duration = Date.now() - startTime

      await this.logger.info('API call completed', {
        endpoint,
        status: response.status,
        duration,
        timestamp: Date.now(),
      })

      return responseData
    } catch (error) {
      const duration = Date.now() - startTime

      await this.logger.error('API call failed', {
        endpoint,
        error: error.message,
        duration,
        timestamp: Date.now(),
      })

      throw error
    }
  }

  private async authenticateUser(userId: string) {
    // Mock authentication
    if (userId === 'invalid') {
      throw new Error('Invalid user ID')
    }

    return {
      sessionId: 'session-' + Math.random().toString(36).substr(2, 9),
      user: { id: userId, name: 'User ' + userId },
    }
  }

  async cleanup() {
    await this.logger.forceUpload()
    this.logger.destroy()
  }
}

// Usage
const app = new WebApp()
app.initialize().then(() => {
  console.log('App ready!')
})
```

## E-commerce Tracking Example

Track user interactions in an e-commerce application:

```typescript
import { Logger } from '@vainjs/logger'

class EcommerceTracker {
  private logger: Logger

  constructor() {
    this.logger = new Logger({
      serverUrl: 'https://analytics.shop.com/events',
      uploadStrategy: 'immediate', // Real-time analytics
      debugMode: false,
      logExpiration: 30, // Keep data for analytics
    })
  }

  async init() {
    await this.logger.init()

    await this.logger.info('Ecommerce tracker initialized', {
      page: window.location.pathname,
      referrer: document.referrer,
      timestamp: Date.now(),
    })
  }

  async trackPageView(page: string) {
    await this.logger.info('Page view', {
      page,
      title: document.title,
      url: window.location.href,
      referrer: document.referrer,
      timestamp: Date.now(),
    })
  }

  async trackProductView(productId: string, productName: string, price: number) {
    await this.logger.info('Product viewed', {
      productId,
      productName,
      price,
      category: 'product_interaction',
      timestamp: Date.now(),
    })
  }

  async trackAddToCart(productId: string, quantity: number, price: number) {
    await this.logger.info('Product added to cart', {
      productId,
      quantity,
      price,
      totalValue: quantity * price,
      category: 'cart_interaction',
      timestamp: Date.now(),
    })
  }

  async trackPurchase(orderId: string, items: any[], total: number) {
    await this.logger.info('Purchase completed', {
      orderId,
      items,
      total,
      itemCount: items.length,
      category: 'conversion',
      timestamp: Date.now(),
    })
  }

  async trackError(error: Error, context?: any) {
    await this.logger.error('Application error', {
      message: error.message,
      stack: error.stack,
      context,
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    })
  }
}

// Usage example
const tracker = new EcommerceTracker()
tracker.init()

// Track events
tracker.trackPageView('/products/shoes')
tracker.trackProductView('shoe-123', 'Running Shoes', 99.99)
tracker.trackAddToCart('shoe-123', 1, 99.99)
```

## Error Monitoring Example

Set up comprehensive error tracking:

```typescript
import { Logger } from '@vainjs/logger'

class ErrorMonitor {
  private logger: Logger

  constructor() {
    this.logger = new Logger({
      serverUrl: 'https://errors.example.com/api/logs',
      uploadStrategy: 'immediate', // Immediate error reporting
      debugMode: true,
      logExpiration: 14, // Keep error logs longer
    })
  }

  async init() {
    await this.logger.init()

    // Set up global error handlers
    this.setupGlobalErrorHandlers()

    await this.logger.info('Error monitor initialized', {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    })
  }

  private setupGlobalErrorHandlers() {
    // Catch JavaScript errors
    window.addEventListener('error', (event) => {
      this.logJavaScriptError(event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        message: event.message,
      })
    })

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logPromiseRejection(event.reason, {
        type: 'unhandledrejection',
      })
    })

    // Catch network errors (if using fetch)
    this.interceptFetchErrors()
  }

  async logJavaScriptError(error: Error, context: any = {}) {
    await this.logger.error('JavaScript Error', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...context,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    })
  }

  async logPromiseRejection(reason: any, context: any = {}) {
    await this.logger.error('Unhandled Promise Rejection', {
      reason: reason?.toString(),
      stack: reason?.stack,
      ...context,
      timestamp: Date.now(),
      url: window.location.href,
    })
  }

  async logNetworkError(url: string, status: number, statusText: string) {
    await this.logger.error('Network Error', {
      url,
      status,
      statusText,
      timestamp: Date.now(),
      referrer: window.location.href,
    })
  }

  async logCustomError(message: string, context: any = {}) {
    await this.logger.error('Custom Error', {
      message,
      context,
      timestamp: Date.now(),
      url: window.location.href,
      stack: new Error().stack,
    })
  }

  private interceptFetchErrors() {
    const originalFetch = window.fetch

    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args)

        if (!response.ok) {
          await this.logNetworkError(args[0]?.toString() || 'unknown', response.status, response.statusText)
        }

        return response
      } catch (error) {
        await this.logNetworkError(args[0]?.toString() || 'unknown', 0, error.message)
        throw error
      }
    }
  }
}

// Usage
const errorMonitor = new ErrorMonitor()
errorMonitor.init()

// Example of logging custom errors
try {
  // Some risky operation
  throw new Error('Something went wrong')
} catch (error) {
  errorMonitor.logCustomError('Failed to process user data', {
    userId: 123,
    operation: 'data_processing',
  })
}
```

## Performance Monitoring Example

Track application performance metrics:

```typescript
import { Logger } from '@vainjs/logger'

class PerformanceMonitor {
  private logger: Logger
  private startTimes: Map<string, number> = new Map()

  constructor() {
    this.logger = new Logger({
      serverUrl: 'https://metrics.example.com/performance',
      uploadStrategy: 'idle',
      batchSize: 100,
      debugMode: false,
    })
  }

  async init() {
    await this.logger.init()

    // Log initial page load performance
    this.logPageLoadMetrics()

    await this.logger.info('Performance monitor initialized', {
      timestamp: Date.now(),
    })
  }

  private logPageLoadMetrics() {
    if (typeof window !== 'undefined' && window.performance) {
      const timing = window.performance.timing

      this.logger.info('Page load metrics', {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        pageLoad: timing.loadEventEnd - timing.navigationStart,
        dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
        tcpConnect: timing.connectEnd - timing.connectStart,
        serverResponse: timing.responseEnd - timing.requestStart,
        domProcessing: timing.domComplete - timing.domLoading,
        timestamp: Date.now(),
      })
    }
  }

  startTimer(operationName: string) {
    this.startTimes.set(operationName, performance.now())
  }

  async endTimer(operationName: string, context: any = {}) {
    const startTime = this.startTimes.get(operationName)
    if (startTime) {
      const duration = performance.now() - startTime
      this.startTimes.delete(operationName)

      await this.logger.info('Performance metric', {
        operation: operationName,
        duration: Math.round(duration),
        ...context,
        timestamp: Date.now(),
      })

      // Log warning for slow operations
      if (duration > 1000) {
        await this.logger.warn('Slow operation detected', {
          operation: operationName,
          duration: Math.round(duration),
          threshold: 1000,
          ...context,
        })
      }
    }
  }

  async logMemoryUsage() {
    if (typeof window !== 'undefined' && (window.performance as any).memory) {
      const memory = (window.performance as any).memory

      await this.logger.info('Memory usage', {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        usagePercentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100),
        timestamp: Date.now(),
      })
    }
  }

  async logUserInteraction(interaction: string, element?: string) {
    await this.logger.debug('User interaction', {
      interaction,
      element,
      timestamp: Date.now(),
      page: window.location.pathname,
    })
  }
}

// Usage example
const perfMonitor = new PerformanceMonitor()
perfMonitor.init()

// Track specific operations
async function loadUserData(userId: string) {
  perfMonitor.startTimer('loadUserData')

  try {
    const response = await fetch(`/api/users/${userId}`)
    const userData = await response.json()

    await perfMonitor.endTimer('loadUserData', {
      userId,
      dataSize: JSON.stringify(userData).length,
    })

    return userData
  } catch (error) {
    await perfMonitor.endTimer('loadUserData', {
      userId,
      error: error.message,
    })
    throw error
  }
}

// Track memory usage periodically
setInterval(() => {
  perfMonitor.logMemoryUsage()
}, 30000) // Every 30 seconds
```

## React Hook Example

Create a React hook for easy integration:

```typescript
import { useEffect, useRef } from 'react'
import { Logger, LoggerConfig } from './dist'

export function useLogger(config?: LoggerConfig) {
  const loggerRef = useRef<Logger | null>(null)

  useEffect(() => {
    const logger = new Logger(config)

    logger.init().then(() => {
      logger.info('React component logger initialized', {
        component: 'useLogger',
        timestamp: Date.now(),
      })
    })

    loggerRef.current = logger

    return () => {
      if (loggerRef.current) {
        loggerRef.current.destroy()
      }
    }
  }, [])

  return loggerRef.current
}

// Usage in React component
function MyComponent() {
  const logger = useLogger({
    debugMode: process.env.NODE_ENV === 'development',
    serverUrl: 'https://api.example.com/logs',
  })

  const handleClick = async () => {
    if (logger) {
      await logger.info('Button clicked', {
        component: 'MyComponent',
        timestamp: Date.now(),
      })
    }
  }

  return <button onClick={handleClick}>Click me</button>
}
```

These examples demonstrate the flexibility and power of the Logger utility across different scenarios and use cases.
