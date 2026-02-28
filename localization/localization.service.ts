import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILocalizationService } from './localization.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService implements ILocalizationService {
  private defaultLanguage = 'en';
  private storageKey = 'orcas-language';

  private translations: any = {};
  private loaded = false;

  private $language: ReturnType<typeof signal<string>>;
  public $currentLang = computed(() => this.$language());

  private http = inject(HttpClient);

  constructor() {
    this.$language = signal(this.getStoredLanguage());
  }

  public async init(
    jsonPath: string = 'assets/translations.json',
    defaultLanguage: string = 'en',
    storageKey: string = 'orcas-language'
  ): Promise<void> {
    this.defaultLanguage = defaultLanguage;
    this.storageKey = storageKey;
    this.$language.set(this.getStoredLanguage());

    try {
      this.translations = await this.http.get(jsonPath).toPromise();
      this.loaded = true;
    }
    catch (err) {
      console.error('Failed to load translations:', err);
    }
  }

  getLanguage(): string {
    return this.$language();
  }

  getDefaultLanguage(): string {
    return this.defaultLanguage;
  }

  setActiveLanguage(lang: string): void {
    if (lang !== this.$language()) {
      localStorage.setItem(this.storageKey, lang);
      this.$language.set(lang);
    }
  }

  translate(key: string, params?: any, language?: string): string {
    const lang = language || this.getLanguage();

    if (!this.loaded) {
      console.error('Localization: Translations not loaded yet!');
      return key;
    }

    let translation = null;

    // Handle pluralization: try singular suffix __1 first if count is 1
    if (params && params.count === 1)
      translation = this.resolveKey(`${key}__1`);

    if (!translation)
      translation = this.resolveKey(key);

    if (!translation) {
      console.warn(`Localization: Key not found for "${key}".`);
      return key;
    }

    let translatedText = translation[lang];

    if (!translatedText) {
      console.warn(`Localization: Key "${key}" not found for language "${lang}". Falling back to default language.`);
      translatedText = translation[this.defaultLanguage];
    }

    if (!translatedText) {
      console.error(`Localization: Key "${key}" not found for default language "${this.defaultLanguage}".`);
      return key;
    }

    if (params) {
      if (Array.isArray(params))
        return this.replaceArrayParams(translatedText, params);
      else
        return this.replaceObjectParams(translatedText, params);
    }

    return translatedText;
  }

  private resolveKey(key: string): any {
    const keys = key.split('.');
    let translation = this.translations;
    for (const k of keys) {
      if (!translation[k])
        return null;
      translation = translation[k];
    }
    return translation;
  }

  private getStoredLanguage(): string {
    return localStorage.getItem(this.storageKey) || this.defaultLanguage;
  }

  private replaceArrayParams(text: string, params: any[]): string {
    let result = text;
    params.forEach((param, index) => {
      result = result.replace(new RegExp(`\\{\\{${index}\\}\\}`, 'g'), param.toString());
    });
    return result;
  }

  private replaceObjectParams(text: string, params: any): string {
    let result = text;
    Object.keys(params).forEach(key => {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), params[key].toString());
    });
    return result;
  }
}
