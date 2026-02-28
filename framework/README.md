# framework

Angular framework utilities that help with application startup and service lifecycle management.

## Files

### `services-init.ts`

`ServicesInit` is a root-level Angular service that provides a typed, async-aware way to retrieve and initialize other services during application bootstrap.

**Why it exists:** Angular's DI container instantiates services lazily and synchronously. `ServicesInit` bridges the gap when a service needs async initialization (e.g. loading a file, fetching config) before the app is ready to use it.

**Method:**

```typescript
async init<T>(serviceClass: any, ...params: unknown[]): Promise<T>
```

- Retrieves the service instance from the injector.
- If the service has an `init(...params)` method, calls it and awaits completion.
- If initialization parameters are provided to a service that has no `init` method, an error is thrown.
- Returns the fully initialized service instance, typed as `T`.

## Usage

```typescript
import { ServicesInit } from '@/lib/orcas-angular/framework/services-init';

// In your app initialization (e.g. APP_INITIALIZER or main bootstrap):
const servicesInit = injector.get(ServicesInit);

await servicesInit.init(FileBoxService, 'app-data.json');
await servicesInit.init(LocalizationService, 'assets/translations.json', 'en');
```
