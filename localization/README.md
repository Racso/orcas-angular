# localization

> A README.md is also available in the `localization` folder.

Angular service and pipe for loading and applying multi-language translations at runtime.

## Files

### `localization.interface.ts`

`ILocalizationService` — interface defining the public contract that any localization service implementation must satisfy.

### `localization.service.ts`

`LocalizationService` is the concrete implementation. It loads a JSON translation file over HTTP and exposes a reactive API based on Angular signals.

**Key features:**
- Loads translations from a configurable JSON string (default: `{}`).
- Persists the active language in `localStorage` and restores it on startup.
- Supports **nested keys** via dot notation (e.g. `"settings.title"`).
- Supports **pluralization** via the `__1` suffix convention (e.g. a key named `"items__1"` is used when `params.count === 1`).
- Supports **parameter substitution** using `{{index}}` (array) or `{{key}}` (object) placeholders.
- Falls back to the default language if a key is missing for the active language.

**Reactive signal:**
- **`$currentLang`** — Computed signal that emits whenever the active language changes.

**Methods:**

| Method | Description |
|---|---|
| `init(translationsJson?, defaultLanguage?, storageKey?)` | Parses the translation JSON string and configures defaults. Call during app bootstrap. |
| `getLanguage()` | Returns the current language code. |
| `getDefaultLanguage()` | Returns the default/fallback language code. |
| `setActiveLanguage(lang)` | Switches the active language and persists it. |
| `translate(key, params?, language?)` | Resolves a translation key with optional parameter substitution. |

### `localize.pipe.ts`

`LocalizePipe` (`| localize`) is an impure standalone pipe that wraps `LocalizationService.translate()`. It re-evaluates only when the language, key, or params change, keeping re-render cost minimal.

## Translation file format

```json
{
  "greeting": {
    "en": "Hello, {{name}}!",
    "es": "¡Hola, {{name}}!"
  },
  "items": {
    "en": "{{count}} items",
    "es": "{{count}} elementos"
  },
  "items__1": {
    "en": "1 item",
    "es": "1 elemento"
  }
}
```

## Usage

```typescript
// Bootstrap (e.g. in APP_INITIALIZER):
const translations = await fetch('assets/translations.json').then(res => res.text());
await servicesInit.init(LocalizationService, translations, 'en');

// In a template:
{{ 'greeting' | localize: { name: 'World' } }}

// Programmatically:
localizationService.translate('items', { count: 3 });
localizationService.setActiveLanguage('es');
```
