# theme

Angular service for managing the application's visual theme (light / dark mode).

## Files

### `theme.service.ts`

`ThemeService` reads and persists the user's theme preference via `SettingsService` and reflects it on the DOM in real time.

**Signals:**
- **`$theme`** — Reactive signal (`Signal<ThemeType>`) holding the current theme preference. Backed by persistent storage so the user's choice survives page reloads.
- **`$darkMode`** — Computed `boolean` signal. Returns `true` when the effective theme is dark. When the stored preference is `ThemeType.Unset`, it automatically falls back to the OS-level `prefers-color-scheme: dark` media query.

Whenever `$darkMode` changes, an Angular `effect` toggles the `dark` CSS class on `document.documentElement`, making the service compatible with Tailwind CSS's `darkMode: 'class'` strategy (or any similar class-based dark-mode approach).

**Method:**
- **`setTheme(theme: ThemeType)`** — Persists the chosen theme and updates the `$theme` signal.

**`ThemeType` enum:**

| Value | Description |
|---|---|
| `ThemeType.Unset` | Follow the OS preference |
| `ThemeType.Light` | Force light mode |
| `ThemeType.Dark` | Force dark mode |

## Usage

```typescript
import { ThemeService, ThemeType } from '@/lib/orcas-angular/theme/theme.service';

export class SettingsComponent {
    private theme = inject(ThemeService);

    // Read current dark-mode state reactively
    isDark = this.theme.$darkMode;

    async toggleTheme() {
        const next = this.theme.$darkMode() ? ThemeType.Light : ThemeType.Dark;
        await this.theme.setTheme(next);
    }
}
```
