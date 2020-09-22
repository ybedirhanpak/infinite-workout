import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

const THEME_DARK = 'THEME_DARK';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(private storage: Storage) {}

  private _darkMode = new BehaviorSubject<boolean>(false);

  get darkMode() {
    return this._darkMode.asObservable();
  }

  private updateBodyTheme(isDark: true) {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  fetchTheme() {
    this.storage.get(THEME_DARK).then((isDark) => {
      this.updateBodyTheme(isDark);
      this._darkMode.next(isDark);
    });
  }

  setTheme(darkMode: boolean) {
    this.storage.set(THEME_DARK, darkMode).then((isDark) => {
      this.updateBodyTheme(isDark);
      this._darkMode.next(isDark);
    });
  }
}
