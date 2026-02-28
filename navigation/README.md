# navigation

Angular utilities for managing navigation history and providing a reliable "go back" behaviour.

## Files

### `navigation-stack.service.ts`

`NavigationStackService` maintains an in-memory history stack by subscribing to Angular Router's `NavigationEnd` events. This gives the application precise control over back-navigation, including a safe fallback to the home route when the history is empty.

**Methods:**
- **`goBack()`** — Navigates to the previous route. Falls back to `"/"` if there is no history.
- **`getBack(): string`** — Returns the URL of the previous route without navigating, or an empty string if unavailable.

### `back-on-click.directive.ts`

`BackOnClickDirective` (`[back-on-click]`) is a standalone directive that calls `NavigationStackService.goBack()` when the host element is clicked. It also prevents the default click behaviour so it can be safely applied to `<a>` elements.

### `index.ts`

Public barrel that re-exports both `NavigationStackService` and `BackOnClickDirective`.

## Usage

```typescript
// In a standalone component:
import { BackOnClickDirective } from '@/lib/orcas-angular/navigation';

@Component({
    imports: [BackOnClickDirective],
    template: `<button back-on-click>← Back</button>`
})
export class MyComponent {}
```

```typescript
// Programmatic back navigation:
import { NavigationStackService } from '@/lib/orcas-angular/navigation';

export class MyComponent {
    private nav = inject(NavigationStackService);

    onClose() {
        this.nav.goBack();
    }
}
```
