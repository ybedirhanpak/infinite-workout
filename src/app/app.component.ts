import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { ThemeService } from './shared/services/theme.service';

const THEME_DARK = 'THEME_DARK';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  // Value of if dark mode is used
  darkMode = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private menuController: MenuController,
    private themeService: ThemeService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.themeService.fetchTheme();
    });
  }

  ngOnInit() {
    // Change darkMode state according to themeService
    this.themeService.darkMode.subscribe((value) => {
      this.darkMode = value;
    });
  }

  /**
   * Navigates to a path and closes menu controller
   *
   * @param path is path of the redirected page
   */
  menuNavigate(path: string) {
    this.router.navigateByUrl(path);
    this.menuController.close();
  }

  /**
   * Changes app theme between light and dark with toggle button event
   */
  toggleDarkMode(event: any) {
    const isDarkChecked = event.detail.checked;
    this.themeService.setTheme(isDarkChecked);
  }
}
