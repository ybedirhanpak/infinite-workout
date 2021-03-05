import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { IonSlides, AlertController } from '@ionic/angular';

// Model
import { ExerciseRecord } from '@models/training.model';
import { Progress } from '@models/progress.model';

// Service
import { ProgressService } from '@services/progress.service';
import { TrainingService } from '@services/training.service';
import { ThemeService } from '@services/theme.service';
import { DateService } from '@services/date.service';

@Component({
  selector: 'app-workout',
  templateUrl: './training.page.html',
  styleUrls: ['./training.page.scss'],
})
export class TrainingPage implements OnInit, OnDestroy {
  /** Subscriptions */
  private subscriptions = new Subscription();

  /** Top Slides */
  @ViewChild('progressSlider') progressSlider: IonSlides;
  progressList: Progress[];
  isLoading = false;

  /** TrainingRecord */
  trainingStarted = false;
  restTime = 60; // total rest in seconds
  currentRestTime = 0;
  restPercent = 0;
  restString = '00:00:00';
  restStringColor = this.themeService.BLACK;
  restInterval: NodeJS.Timeout;
  currentTotalTime = 0;
  totalTimeString = '00:00:00';
  totalTimeInterval: NodeJS.Timeout;

  constructor(
    private progressService: ProgressService,
    private alertController: AlertController,
    private trainingService: TrainingService,
    private themeService: ThemeService,
    private dateService: DateService
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.progressService.progressList.subscribe((progressList) => {
        this.progressList = progressList;
      })
    );

    this.subscriptions.add(
      this.trainingService.restTime.subscribe((value) => {
        this.restTime = value;
      })
    );
  }

  ionViewWillEnter() {
    this.isLoading = true;
    // Fetch progress list when user enters this page
    this.progressService.fetchProgressList().then(() => {
      this.isLoading = false;
    });

    // Fetch rest time value when user enters this page
    this.trainingService.fetchRestTime();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Executes slide behavior of progress slider
   * @param action direction of slide
   */
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

  /**
   * On first execution for each workout, starts the workout.
   * On subsequent executions, resets rest time; until workout is finished.
   */
  onCircleClick() {
    if (!this.trainingStarted) {
      // Start the workout
      this.trainingStarted = true;

      // Start counting rest time
      this.increaseRestTime();
      this.restInterval = setInterval(() => {
        this.increaseRestTime();
      }, 1000);

      // Start counting total time
      this.increaseTotalTime();
      this.totalTimeInterval = setInterval(() => {
        this.increaseTotalTime();
      }, 1000);
    } else {
      // Reset rest time
      if (this.restInterval) {
        clearInterval(this.restInterval);
      }

      this.restString = '00:00:00';
      this.restPercent = 0;
      this.currentRestTime = 0;

      // Re-start counting reset time
      this.increaseRestTime();
      this.restInterval = setInterval(() => {
        this.increaseRestTime();
      }, 1000);
    }
  }

  /**
   * Executes click behavior of stop button
   * Displays an alert to user with these options: Save, Discard, Cancel.
   */
  onStopButtonClick() {
    this.alertController
      .create({
        header: 'Are you sure?',
        message: 'Do you want to end this workout?',
        buttons: [
          {
            text: 'Save',
            handler: () => this.saveTraining(),
          },
          {
            text: 'Discard',
            handler: () => this.stopTraining(),
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

  /**
   * Increases the value of rest time and updates rest time string
   */
  increaseRestTime() {
    this.restString = this.dateService.secondsToString(this.currentRestTime);
    this.restPercent = Math.min(
      (this.currentRestTime / this.restTime) * 100,
      100
    );
    if (this.restPercent === 100) {
      this.restStringColor = this.themeService.RED;
    } else {
      this.restStringColor = this.themeService.BLACK;
    }
    this.currentRestTime++;
  }

  /**
   * Increases the value of total time and updates total time string
   */
  increaseTotalTime() {
    this.totalTimeString = this.dateService.secondsToString(
      this.currentTotalTime
    );
    this.currentTotalTime++;
  }

  /**
   * Clears reset and total time increase intervals.
   * Resets everything on their default.
   */
  resetTraining() {
    this.trainingStarted = false;
    this.currentRestTime = 0;
    this.restPercent = 0;
    this.restString = '00:00:00';
    this.restStringColor = this.themeService.BLACK;
    if (this.restInterval) {
      clearInterval(this.restInterval);
    }
    this.currentTotalTime = 0;
    this.totalTimeString = '00:00:00';
    if (this.totalTimeInterval) {
      clearInterval(this.totalTimeInterval);
    }
  }

  /**
   * Stops workout without saving it.
   */
  stopTraining() {
    this.resetTraining();
  }

  /**
   * Stops workout and saves the workout record
   */
  saveTraining() {
    const exercises: ExerciseRecord[] = this.progressList.map((progress) => {
      return {
        name: progress.currentExercise
          ? progress.currentExercise.name
          : progress.name,
        progressName: progress.name,
        setRep: `${progress.sets} x ${progress.reps}`,
        repType: progress.repType,
      };
    });

    this.trainingService
      .saveTrainingRecord(exercises, new Date(), this.totalTimeString)
      .then(() => {
        this.resetTraining();
        // TODO: Navigate to workout record page
      })
      .catch(() => {
        // TODO: Display error message
      });
  }
}
