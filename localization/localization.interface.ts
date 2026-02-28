import {Signal} from '@angular/core';

export interface ILocalizationService {
    /** Emits the current language as a signal */
    $currentLang: Signal<string>;

    /** Gets the current active language code */
    getLanguage(): string;

    /** Gets the default language code */
    getDefaultLanguage(): string;

    /** Sets the current active language */
    setActiveLanguage(lang: string): void;

    /** Translates a key, possibly with params and for a specific language */
    translate(key: string, params?: any, language?: string): string;
}
