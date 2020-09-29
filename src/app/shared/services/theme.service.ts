import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

const THEME_DARK = 'THEME_DARK';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(private storage: Storage) {}

  private DARK_MODE = new BehaviorSubject<boolean>(false);

  BLACK = 'var(--ion-color-dark, black)';
  RED = 'var(--ion-color-danger, red)';

  get darkMode() {
    return this.DARK_MODE.asObservable();
  }

  /**
   * Updates theme class of body element
   * @param isDark value of if dark mode is used
   */
  private updateBodyTheme(isDark: boolean) {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  /**
   * Retrevies theme value from storage and updates behavior subject
   */
  async fetchTheme() {
    const isDark = await this.storage.get(THEME_DARK);
    this.updateBodyTheme(isDark);
    this.DARK_MODE.next(isDark);
  }

  /**
   * Saves theme value to storages and updates behavior subject
   * @param darkMode value of if dark mode is used
   */
  async setTheme(darkMode: boolean) {
    await this.storage.set(THEME_DARK, darkMode);
    this.updateBodyTheme(darkMode);
    this.DARK_MODE.next(darkMode);
  }
}
