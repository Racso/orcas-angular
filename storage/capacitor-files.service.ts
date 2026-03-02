import { Injectable } from '@angular/core';
import { FilesService } from './files';

@Injectable()
export class CapacitorFilesService extends FilesService {
    static isSupported(): boolean {
        try {
            return !!(window as any).Capacitor?.isNativePlatform();
        } catch {
            return false;
        }
    }

    async init(): Promise<void> {
        // No special initialization needed for Capacitor Filesystem
    }

    async joinStoragePath(filePath: string): Promise<string | null> {
        const { Filesystem, Directory } = await import('@capacitor/filesystem');
        const result = await Filesystem.getUri({ path: filePath, directory: Directory.Data });
        return result.uri;
    }

    async hasInStorage(filePath: string): Promise<boolean> {
        try {
            const { Filesystem, Directory } = await import('@capacitor/filesystem');
            await Filesystem.stat({ path: filePath, directory: Directory.Data });
            return true;
        } catch {
            return false;
        }
    }

    async readFromStorage(filePath: string): Promise<string> {
        const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
        const result = await Filesystem.readFile({
            path: filePath,
            directory: Directory.Data,
            encoding: Encoding.UTF8
        });
        return result.data as string;
    }

    async writeToStorage(filePath: string, data: string): Promise<void> {
        const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
        await Filesystem.writeFile({
            path: filePath,
            data,
            directory: Directory.Data,
            encoding: Encoding.UTF8,
            recursive: true
        });
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
