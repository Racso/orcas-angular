# dev

Development and debugging utilities. These helpers are meant for use during development only and should not be shipped as core application services.

## Files

### `console-hook.ts`

`ConsoleHook` exposes a lightweight command registry that can be invoked from the browser console. It registers a global `window.r(command, ...args)` function so that developers can call application methods without needing to open Angular DevTools.

**Methods:**
- **`ConsoleHook.initialize()`** — Sets up `window.r` if it has not been set up yet.
- **`ConsoleHook.register(commandName, method)`** — Registers a named command. Automatically calls `initialize()`.
- **`ConsoleHook.run(input, ...additionalParams)`** — Parses the input string (command name + space-separated arguments) and executes the matching registered command.

**Browser console usage:**
```javascript
// Call a registered command named "example" with no extra args
r("example")

// Call "myCommand" with arguments
r("myCommand arg1 arg2")
```

### `debug.service.ts.example`

A template showing how to integrate `ConsoleHook` into an Angular service. Copy this file, rename it to `debug.service.ts`, and adapt it to register the commands relevant to your application.

The example registers two commands:
- `"example"` — returns the injected `ExampleService` instance.
- `"nop"` — logs `"nop"` to the console and returns `"1"`.

## Usage

```typescript
import { ConsoleHook } from '@/lib/orcas-angular/dev/console-hook';

// In any service or component constructor:
ConsoleHook.register('reload', () => location.reload());
ConsoleHook.register('clearStorage', () => localStorage.clear());
```
