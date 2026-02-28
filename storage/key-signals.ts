import { computed, Signal } from '@angular/core';

export abstract class KeySignals {
    protected abstract $data(): Record<string, any>;
    protected abstract setRawValue(key: string, value: any): Promise<void>;
    protected abstract setMultipleRawValues(values: Record<string, any>): Promise<void>;

    protected readonly SEPARATOR = '|';

    public getCanonicalKey(path: string[]): string {
        return path.join(this.SEPARATOR);
    }

    public getNewSignal<T>(defaultValue: T, ...path: string[]): Signal<T> {
        return computed(() => this.getValue(defaultValue, ...path));
    }

    public getValue<T>(defaultValue: T, ...path: string[]): T {
        const key = this.getCanonicalKey(path);
        const data = this.$data();
        return key in data ? data[key] : defaultValue;
    }

    public async set(value: any, ...path: string[]): Promise<void> {
        const key = this.getCanonicalKey(path);
        await this.setRawValue(key, value);
    }

    /**
     * Clears all keys that start with the given prefix.
     */
    public async clearByPrefix(...pathPrefix: string[]): Promise<void> {
        const prefix = this.getCanonicalKey(pathPrefix) + this.SEPARATOR;
        const data = this.$data();
        const updatedData = { ...data };
        let changed = false;

        for (const key in updatedData) {
            if (key.startsWith(prefix)) {
                delete updatedData[key];
                changed = true;
            }
        }

        if (changed) {
            await this.setMultipleRawValues(updatedData);
        }
    }
}
