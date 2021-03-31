import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

// Service
import { ThemeService } from '@services/theme.service';
import { TrainingService } from '@services/training.service';
import { WorkoutService } from '@services/workout.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private themeService: ThemeService,
    private screenOrientation: ScreenOrientation,
    private trainingService: TrainingService,
    private workoutService: WorkoutService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      }
      // Fetch values from storage
      this.themeService.fetchTheme();
      this.trainingService.fetchRestTime();

      // Fetch static remote data
      this.workoutService.fetchWorkouts();
    });
  }

  ngOnInit() {}
}
