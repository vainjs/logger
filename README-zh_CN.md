# @vainjs/logger 日志打点工具

简体中文 | [English](./README.md)

📖 **[文档地址](https://vainjs.github.io/logger/)** | 🚀 **[快速开始](#基本使用)**

A fully-featured logging solution with local storage and smart upload strategies.

## 核心功能

✅ **日志方法**: 提供 `info`、`warn`、`error`、`debug`、`trace` 方法  
✅ **灵活配置**: 支持配置本地日志过期时间、服务器地址、debug 模式、上传策略等  
✅ **Debug 模式**: 默认开启，在 debug 模式下打印所有日志，非 debug 模式下只打印 info、warn、error  
✅ **本地存储**: 使用 IndexedDB 在本地保存日志，默认过期时间 3 天  
✅ **智能上传**: 支持空闲时间批量上传和立即上传两种策略  
✅ **自动清理**: 当本地存储空间不足时，自动删除最老的日志

## 安装

```bash
npm install @vainjs/logger
```

## 基本使用

```typescript
import { Logger } from '@vainjs/logger'

// 使用默认配置
const logger = new Logger()

// 初始化（异步）
await logger.init()

// 记录日志
await logger.info('用户登录', { userId: 123, timestamp: Date.now() })
await logger.warn('性能警告', { loadTime: 2000 })
await logger.error('请求失败', { error: 'Network timeout', code: 500 })
await logger.debug('调试信息', { variable: 'value' })
await logger.trace('追踪信息', { stack: 'trace' })
```

## 高级配置

```typescript
import { Logger, LoggerConfig } from '@vainjs/logger'

const config: LoggerConfig = {
  serverUrl: 'https://api.example.com/logs', // 服务器地址
  debugMode: false, // 关闭 debug 模式
  uploadLogs: true, // 开启日志上传
  logExpiration: 7, // 日志保存 7 天
  uploadStrategy: 'immediate', // 立即上传策略
  batchSize: 100, // 批量上传数量
}

const logger = new Logger(config)
await logger.init()
```

## 上传策略

### 1. 空闲上传 (默认)

```typescript
const logger = new Logger({
  uploadStrategy: 'idle', // 在浏览器空闲时批量上传
  batchSize: 50, // 每批上传 50 条日志
})
```

### 2. 立即上传

```typescript
const logger = new Logger({
  uploadStrategy: 'immediate', // 每条日志立即上传
})
```

## 工具方法

```typescript
// 强制上传所有未上传的日志
await logger.forceUpload()

// 获取所有本地日志
const logs = await logger.getAllLogs()
console.log('本地日志数量:', logs.length)

// 清空所有本地日志
await logger.clearAllLogs()

// 获取当前配置
const currentConfig = await logger.getConfig()

// 更新配置
await logger.updateConfig({ debugMode: false })

// 销毁 logger 实例
logger.destroy()
```

## Debug 模式说明

- **Debug 模式开启** (默认): 打印所有级别的日志到控制台
- **Debug 模式关闭**: 只打印 `info`、`warn`、`error` 日志，`debug` 和 `trace` 日志不会打印但仍会存储

```typescript
// Debug 模式开启
const debugLogger = new Logger({ debugMode: true })
await debugLogger.debug('这会打印到控制台')

// Debug 模式关闭
const prodLogger = new Logger({ debugMode: false })
await prodLogger.debug('这不会打印，但会存储')
await prodLogger.info('这会打印到控制台')
```

## 服务器端接口格式

当配置了 `serverUrl` 时，日志会通过 POST 请求发送到服务器：

```json
{
  "logs": [
    {
      "id": "1672531200000-abc123",
      "level": "info",
      "title": "用户登录",
      "data": { "userId": 123 },
      "timestamp": 1672531200000
    }
  ],
  "uploadTime": 1672531201000
}
```

## 浏览器兼容性

- 支持所有现代浏览器 (Chrome, Firefox, Safari, Edge)
- 需要 IndexedDB 支持
- 需要 ES2020+ 支持

## 类型定义

```typescript
interface LoggerConfig {
  serverUrl?: string // 服务器地址
  debugMode?: boolean // Debug 模式 (默认: true)
  uploadLogs?: boolean // 是否上传日志 (默认: true)
  logExpiration?: number // 日志过期天数 (默认: 3)
  uploadStrategy?: 'idle' | 'immediate' // 上传策略 (默认: 'idle')
  batchSize?: number // 批量上传数量 (默认: 50)
}

type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'trace'
```

## 构建和开发

```bash
# 安装依赖
pnpm install

# 构建项目
npm run build

# 开发模式 (监听文件变化)
npm run dev

# 运行测试
npm test

# 清理构建文件
npm run clean
```

## 许可证

MIT
