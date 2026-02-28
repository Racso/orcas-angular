# Echo TypeScript

TypeScript port of the Echo.cs logging library. This is a flexible and powerful logging library with support for log levels, system-based organization, and custom log writers.

## Features

- Structured logging with system tags
- Customizable log levels (per system or global)
- String formatting with parameters (only formatted when log will be written)
- Log-once functionality to prevent duplicate messages
- Extensible with custom log writers
- Console log writer with colors and timestamps included
- TypeScript type safety
- Performance optimized - no allocations when logs are filtered out

## Installation

```bash
# Install dependencies
npm install

# Build the library
npm run build
```

The compiled JavaScript and type definitions will be in the `dist/` folder.

## Quick Start

```typescript
import { EchoConsole, LogLevel } from './dist/echo';

// Create an Echo instance with default console writer
const echo = EchoConsole.new();

// Get a logger
const logger = echo.getLogger();

// Log messages
logger.debug("System", "Debug message");
logger.info("System", "Info message");
logger.warn("System", "Warning message");
logger.error("System", "Error message");
```

## Usage Examples

### Basic Logging

```typescript
import { EchoConsole } from './echo';

const echo = EchoConsole.new();
const logger = echo.getLogger();

// Log with different levels
logger.debug("GUI", "This is a debug message from the GUI system.");
logger.info("Physics", "This is an info message from the Physics system.");
logger.warn("AI", "This is a warning message from the AI system.");
logger.error("Rendering", "This is an error message from the Rendering system.");
```

### System Logger

```typescript
// Get a system-specific logger (cached per system)
const animationLogger = echo.getSystemLogger("Animation");

// No need to specify system in subsequent calls
animationLogger.debug("This is a debug message from the Animation system.");
animationLogger.info("This is an info message from the Animation system.");
animationLogger.warn("This is a warning message from the Animation system.");
animationLogger.error("This is an error message from the Animation system.");
```

### String Formatting

```typescript
// Use formatted strings with parameters
// Formatting is only done IF the log will be written (performance optimization)
const playerName = "John";
const playerHealth = 100;
logger.info("General", "Player {0} has {1} health.", playerName, playerHealth);
// Output: Player John has 100 health.
```

### Log Level Management

```typescript
import { LogLevel } from './echo';

// Set default log level (applies to all systems)
echo.settings.setDefaultLevel(LogLevel.Warn); // Only Warn and Error will be logged

// Set system-specific log level
echo.settings.setSystemLevel("Physics", LogLevel.Debug); // Physics logs everything

// Get current log level for a system
const level = echo.settings.getSystemLevel("Physics");

// Clear a system-specific level (reverts to default)
echo.settings.clearSystemLevel("Physics");

// Clear all system-specific levels
echo.settings.clearSystemLevels();
```

### Log Once

```typescript
// Log a message only once, even if called multiple times
logger.debug1("System", "This will only appear once");
logger.debug1("System", "This will only appear once"); // Won't be logged
logger.debug1("System", "This will only appear once"); // Won't be logged

// Also works with other log levels
logger.info1("System", "Info once");
logger.warn1("System", "Warn once");
logger.error1("System", "Error once");
```

### Custom Configuration

```typescript
import { LogWriterConfig, SystemColor } from './echo';

const config = new LogWriterConfig();
config.timestamp = true;           // Include timestamps (default: true)
config.levelLabels = true;         // Include log level labels (default: true)
config.levelColors = true;         // Use colors for log levels (default: true)
config.systemColor = SystemColor.LabelAndMessage; // Color both label and message

const echo = EchoConsole.new(config);
```

### Custom Log Writer

```typescript
import { Echo, EchoLogWriter, LogLevel } from './echo';

class CustomLogWriter implements EchoLogWriter {
    writeLog(level: LogLevel, system: string, message: string): void {
        // Custom log writing logic here
        const timestamp = new Date().toISOString();
        console.log(`${timestamp} | ${level} | [${system}] ${message}`);
    }
}

// Use custom writer
const customWriter = new CustomLogWriter();
const echo = new Echo(customWriter);
```

## API Reference

### Echo Class

Main entry point for the library.

```typescript
constructor(writer: EchoLogWriter)
```

- **getLogger()**: Returns the main logger instance (cached)
- **getSystemLogger(system: string)**: Returns a system-specific logger (cached per system)
- **settings**: Access to EchoSettings for configuration

### EchoLogger Class

Main logger with system parameter required.

**Methods** (all have the same signature pattern):
- **debug(system: string, message: string, ...params: any[])**
- **info(system: string, message: string, ...params: any[])**
- **warn(system: string, message: string, ...params: any[])**
- **error(system: string, message: string, ...params: any[])**

**Log-once variants** (append `1` to method name):
- **debug1, info1, warn1, error1** - Same signatures as above

### EchoSystemLogger Class

System-specific logger (system is set at creation).

**Methods** (no system parameter needed):
- **debug(message: string, ...params: any[])**
- **info(message: string, ...params: any[])**
- **warn(message: string, ...params: any[])**
- **error(message: string, ...params: any[])**

**Log-once variants**:
- **debug1, info1, warn1, error1** - Same signatures as above

### EchoSettings Class

Configuration for log levels.

- **defaultLevel**: Get/set the default log level
- **setDefaultLevel(level: LogLevel)**: Set default log level for all systems
- **setSystemLevel(system: string, level: LogLevel)**: Set log level for specific system
- **getSystemLevel(system: string)**: Get log level for specific system
- **clearSystemLevel(system: string)**: Remove system-specific level
- **clearSystemLevels()**: Remove all system-specific levels
- **getAllSystemLevels()**: Get all system-specific levels
- **onUpdated(callback: () => void)**: Register callback for settings updates

### LogLevel Enum

```typescript
enum LogLevel {
    None = 0,   // No logging
    Error = 1,  // Errors only
    Warn = 2,   // Warnings and errors
    Info = 3,   // Info, warnings, and errors
    Debug = 4   // All logs (most verbose)
}
```

### LogWriterConfig Class

Configuration for the console log writer.

- **timestamp**: Include timestamps (default: true)
- **levelLabels**: Include log level labels (default: true)
- **levelColors**: Use colors for log levels (default: true)
- **systemColor**: Control system color usage (default: SystemColor.LabelOnly)

### SystemColor Enum

```typescript
enum SystemColor {
    None,              // No color
    LabelOnly,         // Color only the system label
    LabelAndMessage    // Color both label and message
}
```

### EchoConsole Helper

Factory for creating Echo instances with console writer.

```typescript
EchoConsole.new(config?: LogWriterConfig): Echo
```

## Differences from C# Version

The TypeScript port maintains the same API signatures as the C# version with these differences:

1. **Case Convention**: TypeScript methods use camelCase (e.g., `getLogger()`) instead of PascalCase
2. **Generic Overloads**: Instead of C# generic type parameters, TypeScript uses rest parameters (`...params: any[]`)
3. **Events**: Instead of C# events, use `onUpdated(callback)` method to register callbacks
4. **Properties**: C# properties become TypeScript getters/setters
5. **No Unity**: This port excludes all Unity-specific features

## Running the Demo

```bash
# Compile
tsc echo.demo.ts

# Run
node echo.demo.js
```

## Running Tests

```bash
# Compile and run tests
tsc && node echo.test.js
```

## License

Copyright © 2025 Racso
