import { Component, Input, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Theme } from '../../interfaces/theme';
import { ThemeService } from '../../services/theme.service';

interface ThemeOption {
  value: Theme;
  name: string;
  image: string;
}

@Component({
  selector: 'app-dark-mode-toggle',
  templateUrl: './dark-mode-toggle.component.html',
  styleUrls: ['./dark-mode-toggle.component.scss'],
})
export class DarkModeToggleComponent implements OnInit {
  selectedTheme = Theme.light;

  themeOptions: ThemeOption[] = [
    { value: Theme.light, name: 'Light', image: 'assets/img/light-theme.png' },
    { value: Theme.dark, name: 'Dark', image: 'assets/img/dark-theme.png' },
    {
      value: Theme.system,
      name: 'System Theme',
      image: 'assets/img/system-theme.png',
    },
  ];

  constructor(private platform: Platform, private themeService: ThemeService) {
    this.platform.ready().then(() => {
      this.themeService.fetchTheme();
    });
  }

  ngOnInit() {
    // Read initial theme value
    this.themeService.themeValue.subscribe((value) => {
      this.selectedTheme = value;
    });
  }

  /**
   * Updates whole app's theme according to selected value from radio group
   *
   * @param value selected theme option value
   */
  updateSelectedTheme(value: Theme) {
    this.themeService.setTheme(value);
  }
}
