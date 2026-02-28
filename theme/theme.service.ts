import { computed, effect, inject, Injectable } from '@angular/core';
import { SettingsService } from "../storage/settings.service";

export enum ThemeType {
  Unset = '',
  Light = 'light',
  Dark = 'dark',
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private settings = inject(SettingsService);
  public $theme = this.settings.getNewSignal<ThemeType>(ThemeType.Unset, 'theme');

  public $darkMode = computed(() => {
    const theme = this.$theme();
    let isDarkMode: boolean = theme === ThemeType.Unset
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : theme === ThemeType.Dark;

    return isDarkMode;
  });

  private effectSetDarkMode = effect(async () => {
    document.documentElement.classList.toggle('dark', this.$darkMode());
  });

  public async setTheme(theme: ThemeType) {
    await this.settings.set(theme, 'theme');
  }
}
