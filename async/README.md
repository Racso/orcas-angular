# async

Utilities for working with asynchronous operations.

## Files

### `async.ts`

The `Async` class provides static helper methods for common async patterns:

- **`Async.delay(ms)`** — Returns a `Promise` that resolves after a given number of milliseconds. Useful for introducing deliberate pauses in async flows.
- **`Async.until(check, timeoutMs?, frequencyMs?)`** — Polls a condition function at a given interval until it returns `true`. Throws a `Error` if the timeout is exceeded. Defaults to a 10-second timeout and 100 ms polling frequency.

### `cancellation-token.ts`

Provides a cooperative cancellation mechanism inspired by .NET's `CancellationToken` pattern:

- **`CancellationToken`** *(interface)* — Read-only token that exposes `isCancelled()` and `throwIfCancelled()`. Passed to async operations to signal cancellation without forcing an abort.
- **`CancellationTokenSource`** — Owns and controls a `CancellationToken`. Call `cancel()` to signal cancellation, or `newUnique(timeoutMs?)` to cancel the previous token and issue a fresh one (optionally with an auto-cancel timeout).
- **`CancellationError`** — Error subclass thrown by `throwIfCancelled()` when cancellation has been requested.

## Usage

```typescript
import { Async } from '@/lib/orcas-angular/async/async';
import { CancellationTokenSource } from '@/lib/orcas-angular/async/cancellation-token';

// Delay example
await Async.delay(500);

// Poll until condition
await Async.until(() => someFlag === true);

// Cancellation example
const cts = new CancellationTokenSource();
const token = cts.newUnique(5000); // auto-cancels after 5 s

async function doWork() {
    token.throwIfCancelled();
    await Async.delay(100);
    token.throwIfCancelled();
    // ...
}

cts.cancel(); // cancel from outside
```
