import {Pipe, PipeTransform} from '@angular/core';
import {LocalizationService} from './localization.service';

@Pipe({
    name: 'localize',
    standalone: true,
    pure: false
})
export class LocalizePipe implements PipeTransform {
    private lastLanguage: string = '';
    private lastKey: string = '';
    private lastParams: any;
    private lastResult: string = '';

    constructor(private localizationService: LocalizationService) {
    }

    transform(key: string, params?: any): string {
        if (this.localizationService.$currentLang() !== this.lastLanguage
            || key !== this.lastKey
            || params !== this.lastParams) {
            this.lastLanguage = this.localizationService.$currentLang();
            this.lastKey = key;
            this.lastParams = params;
            this.lastResult = this.localizationService.translate(key, params);
        }

        return this.lastResult;
    }
}
