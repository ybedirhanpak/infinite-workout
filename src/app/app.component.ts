import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

const THEME_DARK = 'THEME_DARK';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  showExplore = false;
  darkMode = false;
  initialToggle = false;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private menuController: MenuController,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.get(THEME_DARK).then((isDark) => {
        if (isDark) {
          this.darkMode = true;
          document.body.classList.add('dark');
        } else {
          this.darkMode = false;
          document.body.classList.remove('dark');
        }
      });
    });
  }

  ngOnInit() {}

  menuNavigate(path: string) {
    this.router.navigateByUrl(path);
    this.menuController.close();
  }

  toggleDarkMode(event: any) {
    const isDark = event.detail.checked;

    if (isDark === this.darkMode && this.initialToggle) {
      this.initialToggle = true;
      return;
    }

    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    this.storage.set(THEME_DARK, isDark);
  }

  setDarkMode() {}
}
