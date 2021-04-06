import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  IonSlides,
  ModalController,
  ToastController,
  Platform,
  AlertController,
} from '@ionic/angular';
import { Insomnia } from '@ionic-native/insomnia/ngx';

// Components
import { ClockCircleComponent } from 'src/app/shared/components/clock-circle/clock-circle.component';
import { ExerciseEditPage } from '../exercise-edit/exercise-edit.page';

// Model
import { Workout } from '@models/workout.model';
import { Exercise } from '@models/exercise.model';

// Service
import { DateService } from '@services/date.service';
import { TrainingService } from '@services/training.service';
import { WorkoutService } from '@services/workout.service';
import { ExerciseService } from '@services/exercise.service';

// Utils
import { getSetDetail } from '@utils/exercise.util';
import { TrainingRecord } from '@models/training.model';

interface Clock {
  id: number;
  rest: boolean;
  mode: 'timer' | 'stopwatch';
  max: number;
  current: number;
}

interface ExerciseClock {
  exercise: Exercise;
  nextExercise?: Exercise;
  clock: Clock;
  type: 'weightRep' | 'weightTime' | 'distanceTime';
  currentSet: number;
}

@Component({
  selector: 'app-training',
  templateUrl: './training.page.html',
  styleUrls: ['./training.page.scss'],
})
export class TrainingPage implements OnInit {
  /** Slide */
  @ViewChild(IonSlides) slides: IonSlides;

  slideOptions = {
    initialSlide: 0,
    speed: 500,
    slidesPerView: 1.3,
    centeredSlides: true,
  };

  slideLoaded = false;

  /** Rest */
  restTime = 90; // seconds

  /** Training */
  @ViewChildren(ClockCircleComponent) clocks: QueryList<ClockCircleComponent>;

  trainingStarted: boolean;
  trainingPaused: boolean;
  totalTime: number;
  totalTimeString: string;
  totalTimeInterval: NodeJS.Timeout;

  workout: Workout;
  exerciseClocks: ExerciseClock[];
  currentIndex: number;

  edited = false;

  constructor(
    private dateService: DateService,
    private workoutService: WorkoutService,
    private trainingService: TrainingService,
    private exerciseService: ExerciseService,
    private toastController: ToastController,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
    private platform: Platform,
    private insomnia: Insomnia
  ) {}

  ngOnInit() {
    this.trainingService.restTime.value.subscribe((restTime) => {
      this.restTime = restTime;
    });
  }

  createExerciseClock(exercise: Exercise, index: number) {
    const type = exercise.set.type;

    exercise.set.sets.forEach((set) => {
      set.checked = false;
    });

    const clockSets = exercise.set.sets;

    let clockTime = 0;

    if (type === 'weightRep') {
      // There will be multiple clocks for each set
      // Each clock will be stopwatch starting from 0 up to `rest time`
      clockTime = this.restTime;
    } else if (type === 'weightTime' || type === 'distanceTime') {
      // There will be multiple clocks for each set
      // Each clock will be timer, starting trom `time` down to 0
      const set = clockSets[0];
      const detail = getSetDetail(exercise);
      clockTime = this.convertTimeToSec(set.rep, detail.repUnit);
    }

    return {
      clock: {
        id: index,
        rest: false,
        mode: 'timer',
        max: clockTime,
        current: clockTime,
      },
      exercise: exercise,
      type: type,
      currentSet: 0,
    } as ExerciseClock;
  }

  ionViewWillEnter() {
    // Initialize variables
    this.trainingStarted = false;
    this.trainingPaused = true;
    this.totalTime = 0;
    this.totalTimeString = '00:00:00';
    this.exerciseClocks = [];
    this.currentIndex = 0;
    this.slides.slideTo(this.currentIndex);

    this.workoutService.workoutDetail.get().subscribe((workout) => {
      this.workout = workout;

      // Create exercise clocks
      this.workout.exercises.forEach((exercise, index) => {
        const exerciseClock = this.createExerciseClock(exercise, index);
        this.exerciseClocks.push(exerciseClock);
      });

      // Add 'next' field of each exercise
      for (let i = 0; i < this.exerciseClocks.length - 1; i++) {
        this.exerciseClocks[i].nextExercise = this.exerciseClocks[
          i + 1
        ].exercise;
      }
    });
  }

  ionViewWillLeave() {
    this.stopTraining();
  }

  convertTimeToSec(time: number, unit: string) {
    let result = 0;
    if (unit === 'min') {
      result = time * 60;
    }
    if (unit === 'sec') {
      result = time;
    }
    return result;
  }

  /** Total Time */

  totalTimeTick() {
    if (this.trainingPaused) {
      if (this.totalTimeInterval) clearInterval(this.totalTimeInterval);
      return;
    }

    this.totalTime++;
    this.totalTimeString = this.dateService.secondsToString(
      this.totalTime,
      true
    );
  }

  /** Clock Slide */

  /**
   * Starts time of the training and clock of current exercise
   */
  async startTime() {
    if (!this.totalTimeInterval) {
      // Start total time
      this.totalTimeInterval = setInterval(() => {
        this.totalTimeTick();
      }, 1000);
    }

    // Decide on what to do based on rep type
    const index = await this.slides.getActiveIndex();
    this.currentIndex = index;
    const { type, clock } = this.exerciseClocks[this.currentIndex];

    if (type === 'weightRep') {
      if (clock.rest) {
        this.startClock(clock.id);
      }
    } else if (type === 'weightTime' || type === 'distanceTime') {
      this.startClock(clock.id);
    }
  }

  async pauseTime() {
    // Pause clock
    const currentExercise = this.exerciseClocks[this.currentIndex];
    this.pauseClock(currentExercise.clock.id);

    if (this.totalTimeInterval) {
      // Pause total time
      clearInterval(this.totalTimeInterval);
      this.totalTimeInterval = null;
    }
  }

  /** Training Controllers */

  startTraining() {
    this.trainingStarted = true;
    this.trainingPaused = false;
    this.startTime();

    if (this.platform.is('capacitor') || this.platform.is('cordova')) {
      this.insomnia.keepAwake().then(
        () => console.log('Success on keep awake'),
        () => console.log('Error on keep awake')
      );
    }
  }

  stopTraining() {
    this.trainingStarted = false;
    this.trainingPaused = true;

    if (this.totalTimeInterval) {
      clearInterval(this.totalTimeInterval);
    }

    // Stop all clocks
    this.clocks.forEach((clock) => {
      clock.stop();
    });
  }

  finishTraining() {
    const allowSleep = () => {
      if (this.platform.is('capacitor') || this.platform.is('cordova')) {
        this.insomnia.allowSleepAgain().then(
          () => console.log('Success on sleep again'),
          () => console.log('Error on sleep again')
        );
      }
    };

    const finish = () => {
      // Update workout if edited
      if (this.edited) {
        this.workout.exercises = this.exerciseClocks.map((ec) => ec.exercise);
      }

      // Save this training to training records
      let message = '';

      const trainingRecord: TrainingRecord = {
        id: Date.now(),
        workout: { ...this.workout },
        date: new Date().toLocaleDateString(),
        duration: this.totalTimeString,
      };

      this.trainingService.trainingRecordList
        .create(trainingRecord)
        .then(() => {
          message = 'Training saved into records.';
        })
        .catch((error) => {
          message = error ?? 'An error occured while saving the training.';
        })
        .finally(() => {
          this.toastController
            .create({
              message,
              position: 'top',
              duration: 2000,
            })
            .then((toastEl) => {
              toastEl.present();
            });
        });
      this.router.navigate(['/home/']);
      allowSleep();
    };

    const discard = () => {
      this.router.navigate(['/home/']);
      allowSleep();
    };

    this.alertController
      .create({
        header: 'Finish training?',
        message: 'Do you want to finish and save this training?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Finish without saving',
            handler: discard,
          },
          {
            text: 'Save and Finish',
            handler: finish,
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  /** Slide Controllers */

  async onSlideLoad(event: any) {
    this.slideLoaded = true;
  }

  async onSlideChange(event: any) {
    const nextIndex = await this.slides.getActiveIndex();

    if (!this.trainingPaused) {
      // Stop current clock
      const currentExercise = this.exerciseClocks[this.currentIndex];
      this.pauseClock(currentExercise.clock.id);

      const { type, clock } = this.exerciseClocks[nextIndex];

      // Decide on what to do according to rep type
      if (type === 'weightRep') {
        this.updateClockRest(clock, false);
      } else if (type === 'weightTime' || type === 'distanceTime') {
        this.startClock(clock.id);
      }
    }

    this.currentIndex = nextIndex;
  }

  slideNextIfFinished(ec: ExerciseClock) {
    const { exercise, currentSet } = ec;
    const setCount = exercise.set.sets.length;
    if (currentSet >= setCount) {
      // Go to the next exercise
      this.slides.slideNext();
      return true;
    }
    return false;
  }

  /** Clock Controllers */

  /**
   * Find clock on id and start it
   */
  startClock(id: number) {
    this.clocks.forEach((clock) => {
      if (id === clock.id) {
        clock.start();
      }
    });
  }

  /**
   * Find clock on id and pause it
   */
  pauseClock(id: number) {
    this.clocks.forEach((clock) => {
      if (id === clock.id) {
        clock.pause();
      }
    });
  }

  /**
   * Find clock on id and reset it
   */
  resetClock(id: number) {
    this.clocks.forEach((clock) => {
      if (id === clock.id) {
        clock.reset();
      }
    });
  }

  /**
   * Find clock on id and stop it
   */
  stopClock(id: number) {
    this.clocks.forEach((clock) => {
      if (id === clock.id) {
        clock.stop();
      }
    });
  }

  /**
   * Find clock on id and stop it
   */
  updateClockMax(id: number, max: number) {
    this.clocks.forEach((clock) => {
      if (id === clock.id) {
        clock.updateMax(max);
      }
    });
  }

  /**
   * Find clock on id and stop it
   */
  updateClockColor(id: number, color: 'primary' | 'secondary') {
    this.clocks.forEach((clock) => {
      if (id === clock.id) {
        clock.updateColor(color);
      }
    });
  }

  updateClockRest(clock: Clock, rest: boolean) {
    clock.rest = rest;
    this.updateClockColor(clock.id, rest ? 'secondary' : 'primary');
  }

  /**
   * If training is not started, button is "Start"
   * If training is started and running, button is "Pause"
   * If training is started but not running, button is "Resume"
   */
  onFooterButtonClick() {
    if (!this.trainingStarted) {
      if (this.slideLoaded) {
        this.startTraining();
      } else {
        // Display error message to try again
      }
      return;
    }

    if (this.trainingPaused) {
      // Resume
      this.startTime();
      this.trainingPaused = false;
    } else {
      // Pause
      this.pauseTime();
      this.trainingPaused = true;
    }
  }

  /**
   * This set doesn't mean setter. It is a set of an exercise.
   *
   * If set is not finished -> Finish set and move current set to next
   * If set is finished -> Set current
   */
  onSetClick(event: any, ec: ExerciseClock, index: number) {
    const sets = ec.exercise.set.sets;
    const checked = sets[index].checked;
    const setCount = sets.length;
    if (!checked) {
      // Update checkboxes
      sets[index].checked = true;
      const nextIndex = Math.min(index + 1, setCount);
      ec.currentSet = nextIndex;
      for (let i = 0; i < index; i++) {
        sets[i].checked = true;
      }

      // Display Rest Clock
      this.updateClockRest(ec.clock, true);

      if (!this.trainingStarted) {
        // Start training if not started yet
        this.startTraining();
      }

      this.startClock(ec.clock.id);
    } else {
      // Update checkboxes
      ec.currentSet = index;
      for (let i = index; i < setCount; i++) {
        sets[i].checked = false;
      }
    }
  }

  onNextClick(ec: ExerciseClock) {
    const { type, clock } = ec;
    if (type === 'weightRep') {
      this.onRestSkip(ec);
    } else if (type === 'weightTime' || type === 'distanceTime') {
      if (clock.rest) {
        this.onRestSkip(ec);
      } else {
        this.onNextSet(ec);
      }
    }
  }

  /** Set-Time Controllers */
  onPreviousSet(ec: ExerciseClock) {
    const prevSet = Math.max(ec.currentSet - 1, 0);
    ec.currentSet = prevSet;

    // Reset
    this.updateClockRest(ec.clock, false);
    this.resetClock(ec.clock.id);
  }

  /**
   * Switches set to rest
   */
  onNextSet(ec: ExerciseClock) {
    ec.currentSet += 1;

    // Switch to rest
    this.updateClockRest(ec.clock, true);
    this.updateClockMax(ec.clock.id, this.restTime);

    if (!this.trainingStarted) {
      // Start training if not started yet
      this.startTraining();
    }
  }

  /** Rest Clock Controllers */

  onRestReset(ec: ExerciseClock) {
    this.resetClock(ec.clock.id);
  }

  /**
   * Switches from rest to set
   */
  onRestSkip(ec: ExerciseClock) {
    // Decide on what to do according to rep type
    const detail = getSetDetail(ec.exercise);
    const sets = ec.exercise.set.sets;
    const set = sets[ec.currentSet];
    const clockTime = this.convertTimeToSec(set?.rep, detail?.repUnit);

    if (ec.type === 'weightRep') {
      this.stopClock(ec.clock.id);
      this.updateClockRest(ec.clock, false);
      this.slideNextIfFinished(ec);
    } else if (ec.type === 'weightTime' || ec.type === 'distanceTime') {
      // Try to slide next ec
      const slided = this.slideNextIfFinished(ec);
      // If slide happened, go back to first set
      if (slided) {
        ec.currentSet = 0;
      }
      // Switch to set
      this.updateClockRest(ec.clock, false);
      // Update clock to set time
      this.updateClockMax(ec.clock.id, clockTime);
    }
  }

  onClockFinish(clockFinish: boolean, ec: ExerciseClock) {
    if (clockFinish) {
      if (ec.clock.rest) {
        // Rest to set
        this.onRestSkip(ec);
      } else {
        // Set to rest
        this.onNextSet(ec);
      }
    }
  }

  async onEditClick() {
    const currentEC = this.exerciseClocks[this.currentIndex];
    this.exerciseService.exerciseDetail.set(currentEC.exercise);
    const modal = await this.modalController.create({
      component: ExerciseEditPage,
      componentProps: {
        isModal: true,
      },
    });

    modal.onDidDismiss().then((event) => {
      this.edited = true;
    });

    return await modal.present();
  }

  // UI display
  getWeightUI(ec: ExerciseClock, setIndex: number) {
    const set = ec.exercise.set.sets[setIndex];
    const setDetails = getSetDetail(ec.exercise);
    if (set?.load) return `${set.load} ${setDetails.loadUnit}`;
    return '--';
  }

  getCurrentSetUI(ec: ExerciseClock) {
    const setCount = ec.exercise.set.sets.length;
    return Math.min(ec.currentSet + 1, setCount);
  }

  getChipColorUI(ec: ExerciseClock) {
    return ec.clock.rest ? 'secondary' : 'primary';
  }

  getNextTextUI(ec: ExerciseClock) {
    return ec.clock.rest ? 'Skip' : 'Next';
  }
}
