import { Injectable } from '@angular/core';

@Injectable()
export abstract class FilesService {
    /**
     * Initializes the service. 
     * This should handle any setup required by the specific implementation.
     */
    abstract init(...args: any[]): Promise<void>;

    /**
     * Joins a filename with the storage base directory to get a full path.
     * Returns a string or a Promise of a string depending on implementation.
     * In some platforms, this may return null if paths are not supported.
     */
    abstract joinStoragePath(filePath: string): Promise<string | null>;

    /**
     * Checks if a file exists in the platform-specific storage.
     */
    abstract hasInStorage(filePath: string): Promise<boolean>;

    /**
     * Reads a file from the platform-specific storage.
     */
    abstract readFromStorage(filePath: string): Promise<string>;

    /**
     * Writes data to a file in the platform-specific storage.
     */
    abstract writeToStorage(filePath: string, data: string): Promise<void>;

    /**
     * Checks if a file exists in the project's assets/resources.
     */
    abstract hasInProject(filePath: string): Promise<boolean>;

    /**
     * Reads a file from the project's assets/resources.
     */
    abstract readFromProject(filePath: string): Promise<string>;
}