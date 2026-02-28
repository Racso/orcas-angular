import { inject, Injectable } from '@angular/core';
import { KeySignals } from './key-signals';
import { FileBoxService } from './file-box.service';

@Injectable({
    providedIn: 'root'
})
export class SettingsSignalsService extends KeySignals {
    private filebox = inject(FileBoxService);

    protected override $data(): Record<string, any> {
        return this.filebox.$data();
    }

    protected override async setRawValue(key: string, value: any): Promise<void> {
        this.filebox.set(key, value);
        await this.filebox.save();
    }

    protected override async setMultipleRawValues(values: Record<string, any>): Promise<void> {
        this.filebox.setAll(values);
        await this.filebox.save();
    }
}
