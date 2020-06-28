import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Progress } from '../progress/progress.model';
import { ProgressService } from '../progress/progress.service';
import { Subscription } from 'rxjs';
import { IonSlides, AlertController } from '@ionic/angular';

const MIN_S = 60;
const HOUR_S = 3600;
const MAX_S = HOUR_S * 100 - 1;

const BLACK_COLOR = 'black';
const RED_COLOR = 'var(--ion-color-danger, black)';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
})
export class WorkoutPage implements OnInit, OnDestroy {
  /** Top Slides */
  @ViewChild('progressSlider') progressSlider: IonSlides;
  private listSub: Subscription;
  progressList: Progress[];
  isLoading = false;
  /** Circle Progress*/
  workoutStarted = false;
  restTime = 5; // total rest in seconds
  currentRestTime = 0;
  restPercent = 0;
  restString = '00:00:00';
  restStringColor = 'black';
  restInterval: NodeJS.Timeout;
  currentTotalTime = 0;
  totalTimeString = '00:00:00';
  totalTimeInterval: NodeJS.Timeout;
  constructor(
    private progressService: ProgressService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.listSub = this.progressService.progresses.subscribe((progressList) => {
      this.progressList = progressList;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.progressService.fetchProgresses().subscribe((data) => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.listSub.unsubscribe();
  }

  slideAction(action: 'forward' | 'back') {
    if (!this.progressSlider) {
      return;
    }
    if (action === 'forward') {
      this.progressSlider.slideNext();
    } else if (action === 'back') {
      this.progressSlider.slidePrev();
    }
  }

  secondsToString(sec: number) {
    let seconds = Math.min(sec, MAX_S);
    const hours = Math.floor(seconds / HOUR_S);
    seconds = seconds % HOUR_S;
    const mins = Math.floor(seconds / MIN_S);
    seconds = seconds % MIN_S;

    return `${this.padZero(hours)}:${this.padZero(mins)}:${this.padZero(
      seconds
    )}`;
  }

  padZero(num: number) {
    let zeros = '00';
    if (!num) {
      return zeros;
    }
    const numS = num.toString();
    return zeros.substr(0, zeros.length - numS.length) + numS;
  }

  onCircleClick() {
    /* Start the workout */
    if (!this.workoutStarted) {
      this.workoutStarted = true;

      this.updateRestTime();
      this.restInterval = setInterval(() => {
        this.updateRestTime();
      }, 1000);

      this.updateTotalTime();
      this.totalTimeInterval = setInterval(() => {
        this.updateTotalTime();
      }, 1000);
    } else {
      if (this.restInterval) {
        clearInterval(this.restInterval);
      }

      this.restString = '00:00:00';
      this.restPercent = 0;
      this.currentRestTime = 0;

      this.updateRestTime();
      this.restInterval = setInterval(() => {
        this.updateRestTime();
      }, 1000);
    }
  }

  stopWorkout() {
    this.alertController
      .create({
        header: 'Are you sure?',
        message: 'Do you want to end this workout?',
        buttons: [
          {
            text: 'Yes',
            handler: () => this.resetWorkout(),
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  updateRestTime() {
    this.restString = this.secondsToString(this.currentRestTime);
    this.restPercent = Math.min(
      (this.currentRestTime / this.restTime) * 100,
      100
    );
    if (this.restPercent === 100) {
      this.restStringColor = RED_COLOR;
    } else {
      this.restStringColor = BLACK_COLOR;
    }
    this.currentRestTime++;
  }

  updateTotalTime() {
    this.totalTimeString = this.secondsToString(this.currentTotalTime);
    this.currentTotalTime++;
  }

  resetWorkout() {
    this.workoutStarted = false;
    this.currentRestTime = 0;
    this.restPercent = 0;
    this.restString = '00:00:00';
    this.restStringColor = BLACK_COLOR;
    if (this.restInterval) {
      clearInterval(this.restInterval);
    }
    this.currentTotalTime = 0;
    this.totalTimeString = '00:00:00';
    if (this.totalTimeInterval) {
      clearInterval(this.totalTimeInterval);
    }
  }
}
