---
layout: home

hero:
  name: '@vainjs/logger'
  tagline: A fully-featured logging solution with local storage and smart upload strategies.
  image:
    src: /images/logo.png
    alt: Logger
  actions:
    - theme: brand
      text: Get Started
      link: /guides/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/vainjs/logger

features:
  - icon: 📝
    title: Multiple Log Levels
    details: Support for info, warn, error, debug, and trace logging levels with flexible console output control.

  - icon: 🗄️
    title: Local Storage
    details: Automatic persistence using IndexedDB with configurable expiration and smart cleanup.

  - icon: 🚀
    title: Smart Upload
    details: Two upload strategies - idle-time batch upload or immediate upload to your server.

  - icon: ⚙️
    title: Flexible Configuration
    details: Highly configurable with TypeScript support for server URL, debug mode, and upload settings.

  - icon: 🌐
    title: Browser Compatible
    details: Works in all modern browsers with IndexedDB support and ES2020+ features.

  - icon: 🧪
    title: Well Tested
    details: Comprehensive test suite with TypeScript definitions and excellent developer experience.
---

## Quick Start

Install and set up the logger in just a few steps:

```bash
npm install @vainjs/logger
```

```typescript
import { Logger } from '@vainjs/logger'

const logger = new Logger()
await logger.init()

await logger.info('Application started', { version: '1.0.0' })
await logger.error('Something went wrong', { error: 'details' })
```

## Why Choose Logger?

- **🎯 Production Ready**: Built with TypeScript, thoroughly tested, and production-proven
- **📱 Universal**: Works in browsers and Node.js environments
- **🔧 Developer Friendly**: Excellent TypeScript support with comprehensive documentation
- **⚡ Performance Focused**: Efficient storage and smart upload strategies
- **🌍 Internationalized**: Documentation available in English and Chinese

## What's Next?

<div class="vp-doc">

- **[Installation Guide](/guides/installation)** - Get up and running quickly
- **[Configuration Options](/guides/configuration)** - Customize the logger for your needs
- **[Upload Strategies](/guides/upload-strategies)** - Choose the right upload approach
- **[API Reference](/api/)** - Complete API documentation
- **[Examples](/examples/)** - Real-world usage examples

</div>
