# orcas-angular

A collection of reusable Angular utilities and services, designed with support for Tauri and Capacitor. This library provides structural support for common application needs like storage, localization, theme management, and structured logging.

## Installation

```bash
npm install orcas-angular
```

## Features

- **Storage**: Reactive, file-backed storage layer using Angular signals. Supports Tauri, Capacitor, and `localStorage`.
- **Localization**: JSON-based runtime translation loading and switching.
- **Theme**: Light / dark mode management with system preference fallback.
- **Logging**: Structured logging with log levels and system tags.
- **Async**: Cancellation tokens and cooperative async helpers.
- **UI**: Context menu system with viewport clamping.
- **Navigation**: History stack management with back-navigation protection.
- **Framework**: Async-aware service initialization during app bootstrap.

## Usage

### Root Initialization

Use `ServicesInit` to initialize your file-backed services during app startup:

```typescript
import { ServicesInit, FileBoxService, ThemeService } from 'orcas-angular';

// In your app initialization (e.g., APP_INITIALIZER or similar)
await servicesInit.init(FileBoxService, 'settings.json');
await servicesInit.init(ThemeService);
```

### Storage

```typescript
import { SettingsService } from 'orcas-angular';

export class MyService {
  private settings = inject(SettingsService);
  public $isExpertMode = this.settings.getNewSignal(false, 'expert-mode');

  async toggle() {
    await this.settings.set(!this.$isExpertMode(), 'expert-mode');
  }
}
```

## License

MPL-2.0 + Commons Clause (See LICENSE file for details).
