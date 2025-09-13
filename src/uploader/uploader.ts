import { LogEntry, UploaderInterface } from '../types'

export class LogUploader implements UploaderInterface {
  private serverUrl: string

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl
  }

  async uploadLogs(logs: LogEntry[]): Promise<boolean> {
    if (!this.serverUrl) {
      console.warn('No server URL configured for log upload')
      return false
    }

    if (logs.length === 0) {
      return true
    }

    try {
      const response = await fetch(this.serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs: logs.map((log) => ({
            id: log.id,
            level: log.level,
            title: log.title,
            data: log.data,
            timestamp: log.timestamp,
          })),
          uploadTime: Date.now(),
        }),
      })

      if (response.ok) {
        return true
      } else {
        console.error('Failed to upload logs:', response.status, response.statusText)
        return false
      }
    } catch (error) {
      console.error('Error uploading logs:', error)
      return false
    }
  }
}
