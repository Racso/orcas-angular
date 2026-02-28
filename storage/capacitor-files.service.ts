import { Injectable } from '@angular/core';
import { FilesService } from './files';

@Injectable()
export class CapacitorFilesService extends FilesService {
    static isSupported(): boolean {
        // Capacitor is not yet implemented, so returning false
        return false;
    }

    async init() {
        throw new Error('CapacitorFilesService not implemented');
    }

    async joinStoragePath(filePath: string): Promise<string | null> {
        return null;
    }

    async hasInStorage(filePath: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    async readFromStorage(filePath: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    async writeToStorage(filePath: string, data: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async hasInProject(filePath: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    async readFromProject(filePath: string): Promise<string> {
        throw new Error('Method not implemented.');
    }
}
