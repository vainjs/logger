import { LoggerConfig } from './index'

export const DEFAULT_CONFIG: Required<LoggerConfig> = {
  serverUrl: '',
  debugMode: true,
  uploadLogs: true,
  logExpiration: 3,
  uploadStrategy: 'idle',
  batchSize: 50,
}

export function mergeConfig(userConfig: LoggerConfig = {}): Required<LoggerConfig> {
  return {
    ...DEFAULT_CONFIG,
    ...userConfig,
  }
}
