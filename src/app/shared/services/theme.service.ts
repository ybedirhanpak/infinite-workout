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
      this.DARK_MODE.next(isDark);
    });
  }

  setTheme(darkMode: boolean) {
    this.storage.set(THEME_DARK, darkMode).then((isDark) => {
      this.updateBodyTheme(isDark);
      this.DARK_MODE.next(isDark);
    });
  }
}
