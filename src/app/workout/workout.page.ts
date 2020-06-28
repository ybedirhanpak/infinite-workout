import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Progress } from '../progress/progress.model';
import { ProgressService } from '../progress/progress.service';
import { Subscription } from 'rxjs';
import {
  IonSlides,
  AlertController,
  PickerController,
  PopoverController,
} from '@ionic/angular';
import { ToolbarPopoverComponent } from './toolbar-popover/toolbar-popover.component';
import { WorkoutService } from './workout.service';
import { ExerciseRecord } from './workout.model';

const MIN_S = 60;
const HOUR_S = 3600;
const MAX_S = HOUR_S * 100 - 1;

const BLACK_COLOR = 'var(--ion-color-dark, black)';
const RED_COLOR = 'var(--ion-color-danger, black)';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
})
export class WorkoutPage implements OnInit, OnDestroy {
  /** Popover */
  popover: HTMLIonPopoverElement;
  /** Top Slides */
  @ViewChild('progressSlider') progressSlider: IonSlides;
  private listSub: Subscription;
  progressList: Progress[];
  isLoading = false;
  /** Circle Progress*/
  workoutStarted = false;
  restTime = 120; // total rest in seconds
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
    private alertController: AlertController,
    private popoverController: PopoverController,
    private workoutService: WorkoutService
  ) {}

  ngOnInit() {
    this.listSub = this.progressService.progresses.subscribe((progressList) => {
      this.progressList = progressList;
    });
    this.resetWorkout();
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

  openPopOver(event: any) {
    this.popoverController
      .create({
        component: ToolbarPopoverComponent,
        event: event,
        translucent: true,
        componentProps: {
          restTime: this.secondsToString(this.restTime),
        },
      })
      .then((popover) => {
        this.popover = popover;
        popover.present();

        return popover.onDidDismiss();
      })
      .then((resData) => {
        if (resData.role === 'confirm') {
          const restTimeStr = resData.data;
          this.restTime = this.stringToSeconds(restTimeStr);
        }
      });
  }

  closePopOver() {
    if (this.popover) {
      this.popover.dismiss();
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

  stringToSeconds(str: string) {
    const parsed = str.split(':');
    const h = parseInt(parsed[0]) || 0;
    const m = parseInt(parsed[1]) || 0;
    const s = parseInt(parsed[2]) || 0;

    return h * HOUR_S + m * MIN_S + s;
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

  onStopButtonClick() {
    this.alertController
      .create({
        header: 'Are you sure?',
        message: 'Do you want to end this workout?',
        buttons: [
          {
            text: 'Yes',
            handler: () => this.stopWorkout(),
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

  stopWorkout() {
    const exercises: ExerciseRecord[] = this.progressList.map((progress) => {
      return {
        name: progress.currentExercise
          ? progress.currentExercise.name
          : progress.name,
        progressName: progress.name,
        setRep: `${progress.sets}x${progress.reps} ${progress.repType}`,
      };
    });
    let sub = this.workoutService
      .addWorkout(exercises, new Date(), this.totalTimeString)
      .subscribe(() => {
        sub.unsubscribe();
      });
    this.resetWorkout();
  }
}
