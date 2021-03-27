import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, ToastController } from '@ionic/angular';

// Components
import { ClockCircleComponent } from 'src/app/shared/components/clock-circle/clock-circle.component';

// Model
import { Workout } from '@models/workout.model';
import { Exercise, Set } from '@models/exercise.model';

// Service
import { DateService } from '@services/date.service';
import { TrainingService } from '@services/training.service';
import { WorkoutService } from '@services/workout.service';

// Utils
import { getSetDetail } from '@utils/exercise.util';

interface ClockSet extends Set {
  checked: boolean;
}

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
  sets: ClockSet[];
  setCount: number;
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

  constructor(
    private dateService: DateService,
    private workoutService: WorkoutService,
    private trainingService: TrainingService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.trainingService.restTime.subscribe((restTime) => {
      this.restTime = restTime;
    });
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
        const detail = getSetDetail(exercise);
        const type = exercise.set.type;

        const clockSets = exercise.set.sets.map((s) => {
          return {
            ...s,
            checked: false,
          } as ClockSet;
        });

        const set = clockSets[0];
        const clockTime = this.convertTimeToSec(set.rep, detail.repUnit);

        if (type === 'weightRep') {
          // There will be multiple clocks for each set
          // Each clock will be stopwatch starting from 0 up to 2 mins
          this.exerciseClocks.push({
            exercise: exercise,
            clock: {
              id: index,
              rest: false,
              mode: 'timer',
              max: this.restTime,
              current: this.restTime,
            },
            sets: clockSets,
            setCount: clockSets.length,
            currentSet: 0,
            type: exercise.set.type,
          });
        }

        if (type === 'weightTime') {
          // There will be multiple clocks for each set
          // Each clock will be timer, starting trom `time` down to 0
          this.exerciseClocks.push({
            clock: {
              id: index,
              rest: false,
              mode: 'timer',
              max: clockTime,
              current: clockTime,
            },
            exercise: exercise,
            type: type,
            sets: clockSets,
            setCount: clockSets.length,
            currentSet: 0,
          });
        }

        if (type === 'distanceTime') {
          // There will be single clock for the time
          // The clock will be timer
          this.exerciseClocks.push({
            clock: {
              id: index,
              rest: false,
              mode: 'timer',
              max: clockTime,
              current: clockTime,
            },
            exercise: exercise,
            type: type,
            sets: clockSets,
            setCount: clockSets.length,
            currentSet: 0,
          });
        }
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
    const currentExercise = this.exerciseClocks[this.currentIndex];

    switch (currentExercise.type) {
      case 'weightRep':
        if (currentExercise.clock.rest) {
          this.startClock(currentExercise.clock.id);
        }
        break;
      case 'weightTime':
        this.startClock(currentExercise.clock.id);
        break;
      case 'distanceTime':
        this.startClock(currentExercise.clock.id);
        break;
      default:
        break;
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
    this.router.navigate(['/home/']);

    if (this.trainingStarted) {
      // Save this training to training records

      let message = '';

      this.trainingService
        .saveTrainingRecord(this.workout, new Date(), this.totalTimeString)
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
    }
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

      const nextExercise = this.exerciseClocks[nextIndex];

      // Decide on what to do according to rep type
      switch (nextExercise.type) {
        case 'weightRep':
          this.updateClockRest(nextExercise.clock, false);
          break;
        case 'weightTime':
          this.startClock(nextExercise.clock.id);
          break;
        case 'distanceTime':
          this.startClock(nextExercise.clock.id);
          break;
        default:
          break;
      }
    }

    this.currentIndex = nextIndex;
  }

  slideNextIfFinished(exercise: ExerciseClock) {
    const { setCount, currentSet } = exercise;
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
  onSetClick(event: any, exercise: ExerciseClock, index: number) {
    const checked = exercise.sets[index].checked;
    const setCount = exercise.setCount;
    if (!checked) {
      // Update checkboxes
      exercise.sets[index].checked = true;
      const nextIndex = Math.min(index + 1, setCount);
      exercise.currentSet = nextIndex;
      for (let i = 0; i < index; i++) {
        exercise.sets[i].checked = true;
      }

      // Display Rest Clock
      this.updateClockRest(exercise.clock, true);

      if (!this.trainingStarted) {
        // Start training if not started yet
        this.startTraining();
      }

      this.startClock(exercise.clock.id);
    } else {
      // Update checkboxes
      exercise.currentSet = index;
      for (let i = index; i < setCount; i++) {
        exercise.sets[i].checked = false;
      }
    }
  }

  /** Set-Time Controllers */
  onPreviousSet(exercise: ExerciseClock) {
    const prevSet = Math.max(exercise.currentSet - 1, 0);
    exercise.currentSet = prevSet;

    // Reset
    this.updateClockRest(exercise.clock, false);
    this.resetClock(exercise.clock.id);
  }

  /**
   * Switches set to rest
   */
  onNextSet(exercise: ExerciseClock) {
    exercise.currentSet += 1;

    // Switch to rest
    this.updateClockRest(exercise.clock, true);
    this.updateClockMax(exercise.clock.id, this.restTime);

    if (!this.trainingStarted) {
      // Start training if not started yet
      this.startTraining();
    }
  }

  /** Rest Clock Controllers */

  onRestReset(exercise: ExerciseClock) {
    this.resetClock(exercise.clock.id);
  }

  /**
   * Switches from rest to set
   */
  onRestSkip(exercise: ExerciseClock) {
    // Decide on what to do according to rep type
    const detail = getSetDetail(exercise.exercise);
    const set = exercise.sets[exercise.currentSet];
    const clockTime = this.convertTimeToSec(set?.rep, detail?.repUnit);
    switch (exercise.type) {
      case 'weightRep':
        this.stopClock(exercise.clock.id);
        this.updateClockRest(exercise.clock, false);
        this.slideNextIfFinished(exercise);
        break;
      case 'weightTime':
        // Try to slide next exercise
        const slided = this.slideNextIfFinished(exercise);
        // If slide happened, go back to first set
        if (slided) {
          exercise.currentSet = 0;
        }
        // Switch to set
        this.updateClockRest(exercise.clock, false);
        // Update clock to set time
        this.updateClockMax(exercise.clock.id, clockTime);
        break;
      case 'distanceTime':
        this.stopClock(exercise.clock.id);
        // Switch to set
        this.updateClockRest(exercise.clock, false);
        // Update clock to set time
        this.updateClockMax(exercise.clock.id, clockTime);
        // Slide next exercise
        this.slides.slideNext();
        break;
      default:
        break;
    }
  }

  onClockFinish(clockFinish: boolean, exercise: ExerciseClock) {
    if (clockFinish) {
      if (exercise.clock.rest) {
        // Rest to set
        this.onRestSkip(exercise);
      } else {
        // Set to rest
        this.onNextSet(exercise);
      }
    }
  }

  // UI display
  getWeightUI(exercise: ExerciseClock, setIndex: number) {
    const set = exercise.exercise.set.sets[setIndex];
    const setDetails = getSetDetail(exercise.exercise);
    return `${set.load} ${setDetails.loadUnit}`;
  }

  getCurrentSetUI(exercise: ExerciseClock) {
    return Math.min(exercise.currentSet + 1, exercise.setCount);
  }

  getChipColorUI(exercise: ExerciseClock) {
    return exercise.clock.rest ? 'secondary' : 'primary';
  }
}
