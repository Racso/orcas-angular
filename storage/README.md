# storage

Reactive, file-backed storage layer for application and repository settings. Built on Angular signals and an abstract file service that can be backed by different platforms (Tauri, Capacitor, or `localStorage`).

## Architecture overview

```
FilesService (abstract)
    ├── TauriFilesService       — Tauri desktop file system
    ├── CapacitorFilesService   — Capacitor mobile file system
    └── LocalStorageFilesService — Browser localStorage (fallback)

FileBoxService                  — reads/writes a single JSON file via FilesService
    └── SettingsSignalsService (extends KeySignals)
            └── SettingsService — scoped to the "app-settings" key
```

## Files

### `files.ts`

Abstract `FilesService` class. Defines the platform-agnostic contract for file operations:

| Method | Description |
|---|---|
| `init(...args)` | Platform-specific setup |
| `joinStoragePath(filePath)` | Resolves a path relative to the storage root |
| `hasInStorage(filePath)` | Checks existence in writable storage |
| `readFromStorage(filePath)` | Reads a file from writable storage |
| `writeToStorage(filePath, data)` | Writes a file to writable storage |
| `hasInProject(filePath)` | Checks existence in project assets |
| `readFromProject(filePath)` | Reads a file from project assets |

### `tauri-files.service.ts` / `capacitor-files.service.ts` / `local-storage-files.service.ts`

Concrete implementations of `FilesService` for Tauri, Capacitor, and browser `localStorage`.

### `file-box.service.ts`

`FileBoxService` loads and persists an entire JSON file as a flat key→value map. It exposes a reactive `$data` signal so that anything that reads from the box re-renders automatically when data changes. Saves are debounced so that multiple rapid changes are flushed in a single write.

**Init:** must be called once during bootstrap: `init(path: string)`.

### `key-signals.ts`

Abstract `KeySignals` base class. Provides a hierarchical key system where multiple string path segments are joined with a `|` separator to form a flat storage key. Subclasses implement the three abstract methods to wire `KeySignals` to an actual storage backend.

**API:**

| Method | Description |
|---|---|
| `getNewSignal<T>(defaultValue, ...path)` | Returns a computed `Signal<T>` for the given path |
| `getValue<T>(defaultValue, ...path)` | Reads the value synchronously |
| `set(value, ...path)` | Persists a value at the given path |
| `clearByPrefix(...pathPrefix)` | Removes all keys that share a common prefix |

### `settings-signals.service.ts`

`SettingsSignalsService` extends `KeySignals` and connects it to `FileBoxService`. All reads and writes go through the reactive `$data` signal and the file-save pipeline.

### `settings.service.ts`

`SettingsService` wraps `SettingsSignalsService` with a fixed `"app-settings"` namespace, providing a clean API for global application settings.

### `settings.service.spec.ts` / `signal-caching.spec.ts` / `key-signals.spec.ts`

Unit tests for the storage layer.

## Usage

```typescript
// Global app setting (persists across sessions)
const isDarkMode = settingsService.getNewSignal(false, 'theme', 'dark');
await settingsService.set(true, 'theme', 'dark');
```
