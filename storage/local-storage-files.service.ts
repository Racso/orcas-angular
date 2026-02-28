import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { FilesService } from './files';

@Injectable()
export class LocalStorageFilesService extends FilesService {
    private http = inject(HttpClient);

    static isSupported(): boolean {
        return typeof window !== 'undefined' && !!window.localStorage;
    }

    async init() {
        // LocalStorage is ready immediately
    }

    async joinStoragePath(filePath: string): Promise<string | null> {
        return null;
    }

    async hasInStorage(filePath: string): Promise<boolean> {
        return localStorage.getItem(filePath) !== null;
    }

    async readFromStorage(filePath: string): Promise<string> {
        const data = localStorage.getItem(filePath);
        if (data === null) throw new Error(`File not found in localStorage: ${filePath}`);
        return data;
    }

    async writeToStorage(filePath: string, data: string): Promise<void> {
        localStorage.setItem(filePath, data);
    }

    async hasInProject(filePath: string): Promise<boolean> {
        try {
            // In a browser, we check if we can fetch it via HTTP
            await lastValueFrom(this.http.head(filePath));
            return true;
        } catch {
            return false;
        }
    }

    async readFromProject(filePath: string): Promise<string> {
        return await lastValueFrom(this.http.get(filePath, { responseType: 'text' }));
    }
}
