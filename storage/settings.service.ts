import { inject, Injectable, Signal } from "@angular/core";
import { FileBoxService } from "./file-box.service";
import { SettingsSignalsService } from "./settings-signals.service";

@Injectable({
    providedIn: "root"
})
export class SettingsService {
    private fileboxService = inject(FileBoxService);
    private sss = inject(SettingsSignalsService);
    private readonly SETTINGS_KEY = "app-settings";

    public getNewSignal<T>(defaultValue: T, ...path: string[]): Signal<T> {
        return this.sss.getNewSignal(defaultValue, this.SETTINGS_KEY, ...path);
    }

    public async set(value: any, ...path: string[]): Promise<void> {
        await this.sss.set(value, this.SETTINGS_KEY, ...path);
    }

    public async save(): Promise<void> {
        await this.fileboxService.save();
    }
}
