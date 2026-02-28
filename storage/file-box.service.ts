import { computed, inject, Injectable, signal } from '@angular/core';
import { FilesService } from './files';
import { Async } from "../async/async";

enum Status {
    NotInitialized,
    Loading,
    Idle,
    Saving
}

interface BoxData {
    [key: string]: any;
}

@Injectable({
    providedIn: 'root'
})
export class FileBoxService {
    private files: FilesService = inject(FilesService);
    private status: Status = Status.NotInitialized;
    private path: string = '';

    private saveEnqueued: boolean = false;

    private $dataWritable = signal<BoxData>({});
    public $data = computed(() => {
        if (this.status === Status.NotInitialized)
            console.error('Service is not initialized.');
        else if (this.status === Status.Loading)
            console.error('Service is loading.');

        return this.$dataWritable();
    });

    async init(path: string) {
        if (this.status !== Status.NotInitialized) {
            console.error('Service is already initialized.');
            return;
        }

        this.path = path;

        try {
            this.status = Status.Loading;
            if (await this.files.hasInStorage(this.path)) {
                const fileContent = await this.files.readFromStorage(this.path);
                this.$dataWritable.set(JSON.parse(fileContent));
            }
        }
        catch (error) {
            console.error('Failed to load file:', error);
            this.$dataWritable.set({});
        }
        finally {
            this.status = Status.Idle;
        }
    }

    has(key: string): boolean {
        return key in this.$data();
    }

    set(key: string, value: any): void {
        this.checkType(value);
        const newData = { ...this.$dataWritable() };
        newData[key] = value;
        this.$dataWritable.set(newData);
    }

    setAll(data: BoxData): void {
        this.$dataWritable.set(data);
    }

    remove(key: string): void {
        const newData = { ...this.$dataWritable() };
        delete newData[key];
        this.$dataWritable.set(newData);
    }

    private checkType(value: any) {
        if (value instanceof Function)
            throw new Error('Cannot save functions.');

        if (value instanceof Promise)
            throw new Error('Cannot save promises.');
    }

    async save() {
        if (this.saveEnqueued)
            return;

        this.saveEnqueued = true;

        while (this.status === Status.Saving)
            await Async.delay(100);

        this.saveEnqueued = false;

        try {
            this.status = Status.Saving;
            const dataString = JSON.stringify(this.$data());
            await this.files.writeToStorage(this.path, dataString);
        }
        catch (error) {
            console.error('Failed to save file:', error);
        }
        finally {
            this.status = Status.Idle;
        }
    }
}
