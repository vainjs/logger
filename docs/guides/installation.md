# Installation

## Prerequisites

Before installing the Logger utility, ensure your environment meets these requirements:

- **Node.js**: Version 16 or higher
- **Package Manager**: npm, yarn, or pnpm
- **Browser Support**: Modern browsers with IndexedDB support
- **TypeScript**: Version 5.0+ (for TypeScript projects)

## Package Installation

### Using npm

```bash
npm install @vainjs/logger
```

### Using yarn

```bash
yarn add @vainjs/logger
```

### Using pnpm

```bash
pnpm add @vainjs/logger
```

## Build the Package

After installation, build the TypeScript source:

```bash
npm run build
```

This will generate the compiled JavaScript files in the `dist/` directory.

## Verify Installation

Test that everything is working correctly:

```typescript
import { Logger } from '@vainjs/logger'

const logger = new Logger()
logger.init().then(() => {
  console.log('Logger is ready!')
})
```

## Development Setup

For development and contribution:

```bash
# Clone the repository
git clone https://github.com/vainjs/logger.git
cd logger

# Install dependencies
pnpm install

# Start development mode
npm run dev

# Run tests in watch mode
npm run test -- --watch
```

## Browser Usage

For direct browser usage, you can import the built files:

```html
<script type="module">
  import { Logger } from '@vainjs/logger'

  const logger = new Logger()
  await logger.init()
  await logger.info('Browser logger ready!')
</script>
```

## Node.js Usage

In Node.js environments:

```javascript
const { Logger } = require('@vainjs/logger')

const logger = new Logger()
logger.init().then(() => {
  logger.info('Node.js logger ready!')
})
```

## TypeScript Integration

For TypeScript projects, the package includes full type definitions:

```typescript
import { Logger, LoggerConfig } from '@vainjs/logger'

const config: LoggerConfig = {
  debugMode: true,
  serverUrl: 'https://api.example.com/logs',
}

const logger = new Logger(config)
```

## Next Steps

- [Quick Start Guide](./getting-started.md)
- [Configuration Options](./configuration.md)
- [API Reference](../api/index.md)
