// Setup for Jest tests
// Mock IndexedDB for testing environment
if (typeof window === 'undefined') {
  global.indexedDB = {
    open: jest.fn(),
    deleteDatabase: jest.fn(),
  } as any
}

// Mock fetch for testing
global.fetch = jest.fn()
