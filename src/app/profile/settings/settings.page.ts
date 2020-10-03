import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ThemeService } from 'src/app/shared/services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  // Value of if dark mode is used
  darkMode = false;

  constructor(private platform: Platform, private themeService: ThemeService) {
    this.platform.ready().then(() => {
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
   * Changes app theme between light and dark with toggle button event
   */
  toggleDarkMode(event: any) {
    const isDarkChecked = event.detail.checked;
    this.themeService.setTheme(isDarkChecked);
  }
}
