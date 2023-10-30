import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

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
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.screenOrientation.lock(
          this.screenOrientation.ORIENTATIONS.PORTRAIT
        );
      }

      // Fetch values from storage
      this.themeService.fetchTheme();
      this.trainingService.restTime.fetch();
      this.trainingService.trainingRecordList.fetchFromStorage();

      // Fetch static remote data
      this.workoutService.fetchWorkouts();
    });
  }

  ngOnInit() {}
}
