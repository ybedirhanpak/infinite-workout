import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';


export enum Theme {
  light = 'light',
  dark = 'dark',
  system = 'system',
}

const THEME_STORAGE_KEY = 'THEME_STORAGE_KEY';
const THEME_DEFAULT = Theme.dark;

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(private storage: Storage) {}

  // Some colors to be used in some parts of the app
  public BLACK = 'var(--ion-color-dark, black)';
  public RED = 'var(--ion-color-danger, red)';

  private THEME_VALUE = new BehaviorSubject<Theme>(THEME_DEFAULT);

  get themeValue() {
    return this.THEME_VALUE.asObservable();
  }

  /**
   * Updates theme class of body element
   * @param theme value of selected theme
   */
  private updateBodyTheme(theme: Theme) {
    if (theme === Theme.dark) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else if (theme === Theme.light) {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    } else {
      document.body.classList.remove('light');
      document.body.classList.remove('dark');
    }
  }

  /**
   * Retrevies theme value from storage and updates behavior subject
   */
  async fetchTheme() {
    let theme = await this.storage.get(THEME_STORAGE_KEY);
    if(!theme) {
      theme = THEME_DEFAULT;
      await this.storage.set(THEME_STORAGE_KEY, theme);
    }
    this.updateBodyTheme(theme);
    this.THEME_VALUE.next(theme);
  }

  /**
   * Saves theme value to storages and updates behavior subject
   * @param theme value of selected theme
   */
  async setTheme(theme: Theme) {
    await this.storage.set(THEME_STORAGE_KEY, theme);
    this.updateBodyTheme(theme);
    this.THEME_VALUE.next(theme);
  }
}
