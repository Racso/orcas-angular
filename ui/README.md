# ui

Reusable UI components for the application. Currently contains the context menu system.

## Folders

### `context-menu/`

A fully self-contained context menu implementation built with Angular standalone components and directives. It handles viewport clamping automatically so that menus never render off-screen, and supports nested sub-menus.

**Components and directives:**

| File | Selector | Description |
|---|---|---|
| `context-menu.component.ts` | `<context-menu>` | Container that renders a floating menu panel at a given (x, y) coordinate. Can be used as a top-level menu or as an `isSubmenu` variant that positions itself adjacent to the parent button. |
| `context-button.component.ts` | `<context-button>` | Menu item button. Supports `danger` and `disabled` inputs and an optional `hasSubmenu` flag that reveals a `▶` indicator and conditionally renders a nested `<context-menu>` on hover. |
| `context-header.component.ts` | `<context-header>` | Non-interactive section header / label for grouping menu items. |
| `context-menu-trigger.directive.ts` | `[appContextMenu]` | Applied to any element. Intercepts the `contextmenu` event, prevents the default browser menu, and calls `show(x, y)` on the bound `ContextMenuComponent`. Emits a `beforeOpen` output before the menu opens, which is useful for preparing dynamic menu content. |
| `index.ts` | — | Public barrel re-exporting all of the above. |

**Usage:**

```html
<div [appContextMenu]="menu" (beforeOpen)="prepareMenu()">
    Right-click me
</div>

<context-menu #menu>
    <context-header>Actions</context-header>

    <context-button (click)="doSomething()">Do something</context-button>

    <context-button danger (click)="deleteItem()">Delete</context-button>

    <context-button [hasSubmenu]="true">
        More…
        <context-menu [isSubmenu]="true">
            <context-button (click)="doNested()">Nested action</context-button>
        </context-menu>
    </context-button>
</context-menu>
```
