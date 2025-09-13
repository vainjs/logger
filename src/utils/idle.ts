export class IdleDetector {
  private idleTimeout: number
  private idleTimer: ReturnType<typeof setTimeout> | null = null
  private onIdleCallback: (() => void) | null = null
  private lastActivity: number
  private isIdle = false

  constructor(idleTimeoutMs: number = 5000) {
    this.idleTimeout = idleTimeoutMs
    this.lastActivity = Date.now()
    this.setupActivityListeners()
    this.startIdleTimer()
  }

  onIdle(callback: () => void): void {
    this.onIdleCallback = callback
  }

  private setupActivityListeners(): void {
    // Only setup listeners if we're in a browser environment
    if (typeof window !== 'undefined') {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']

      const resetIdleTimer = () => {
        this.lastActivity = Date.now()
        this.isIdle = false
        this.resetTimer()
      }

      events.forEach((event) => {
        document.addEventListener(event, resetIdleTimer, true)
      })

      // Store event listeners for cleanup
      this.cleanup = () => {
        events.forEach((event) => {
          document.removeEventListener(event, resetIdleTimer, true)
        })
      }
    } else {
      // In non-browser environment, consider always idle after timeout
      this.cleanup = () => {}
    }
  }

  private cleanup: () => void = () => {}

  private startIdleTimer(): void {
    this.resetTimer()
  }

  private resetTimer(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer)
    }

    this.idleTimer = setTimeout(() => {
      if (!this.isIdle) {
        this.isIdle = true
        if (this.onIdleCallback) {
          this.onIdleCallback()
        }
      }
    }, this.idleTimeout)
  }

  destroy(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer)
      this.idleTimer = null
    }
    this.cleanup()
    this.onIdleCallback = null
  }
}
