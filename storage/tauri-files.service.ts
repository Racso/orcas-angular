import { Injectable } from '@angular/core';
import { FilesService } from './files';

@Injectable()
export class TauriFilesService extends FilesService {
    private static _isTauri: boolean | null = null;

    static isSupported(): boolean {
        if (this._isTauri !== null) return this._isTauri;

        try {
            // Check for window.__TAURI_INTERNALS__ which is usually present in v2
            this._isTauri = !!((window as any).__TAURI_INTERNALS__);
        } catch {
            this._isTauri = false;
        }
        return this._isTauri;
    }

    async init() {
        // No special initialization needed for Tauri FS plugin beyond what is handled lazily
    }

    async joinStoragePath(filePath: string): Promise<string | null> {
        const { appLocalDataDir, join } = await import('@tauri-apps/api/path');
        const dataDir = await appLocalDataDir();
        return await join(dataDir, filePath);
    }

    async hasInStorage(filePath: string): Promise<boolean> {
        try {
            const { exists } = await import('@tauri-apps/plugin-fs');
            const { BaseDirectory } = await import('@tauri-apps/api/path');
            return await exists(filePath, { baseDir: BaseDirectory.AppLocalData });
        } catch (error) {
            console.error('TauriFilesService.hasInStorage error:', error);
            return false;
        }
    }

    async readFromStorage(filePath: string): Promise<string> {
        const { readTextFile } = await import('@tauri-apps/plugin-fs');
        const { BaseDirectory } = await import('@tauri-apps/api/path');
        return await readTextFile(filePath, { baseDir: BaseDirectory.AppLocalData });
    }

    async writeToStorage(filePath: string, data: string): Promise<void> {
        const { writeTextFile } = await import('@tauri-apps/plugin-fs');
        const { BaseDirectory } = await import('@tauri-apps/api/path');
        await writeTextFile(filePath, data, { baseDir: BaseDirectory.AppLocalData });
    }

    async hasInProject(filePath: string): Promise<boolean> {
        try {
            const response = await fetch(filePath, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    async readFromProject(filePath: string): Promise<string> {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to read project file: ${filePath} (${response.status})`);
        }
        return await response.text();
    }
}
