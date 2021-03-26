import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, ToastController } from '@ionic/angular';

// Model
import { Workout, SetRep, Time, SetTime } from '@models/workout.model';

// Service
import { DateService } from '@services/date.service';
import { TrainingService } from '@services/training.service';
import { WorkoutService } from '@services/workout.service';
import { ClockCircleComponent } from 'src/app/shared/components/clock-circle/clock-circle.component';

// Utils
import { getSetDetail } from '@utils/exercise.util';
import { Exercise } from '@models/exercise.model';

// Exercise card types

interface CSetRep extends SetRep {
  type: 'setRep';
  opts: {
    set: number;
    currentSet: number;
    sets: [
      {
        rep: number;
        weight: number;
        unit: 'kg' | 'lb';
        checked: boolean;
      }
    ];
  };
}

interface CTime extends Time {
  type: 'time';
  opts: {
    time: number;
    unit: 'min' | 'sec';
  };
}

interface CSetTime extends SetTime {
  type: 'setTime';
  opts: {
    set: number;
    currentSet: number;
    sets: [
      {
        rep: number;
        time: number;
        unit: 'min' | 'sec';
        checked: boolean;
      }
    ];
  };
}

interface Clock {
  id: number;
  rest: boolean;
  mode: 'timer' | 'stopwatch';
  max: number;
  current: number;
}

interface ExerciseClock {
  rep: CSetRep | CTime | CSetTime;
  clock: Clock;
  next?: string;
  exercise?: Exercise;
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
        const setDetail = getSetDetail(exercise);
        const load = setDetail.load;

        let time = 0;
        let unit: 'min' | 'sec' = 'sec';
        let clockTime = 0;

        const setType = exercise.set.type;

        if (setType === 'weightRep') {
          // There will be multiple clocks for each set
          // Each clock will be stopwatch starting from 0 up to 2 mins
          const repSets = exercise.set.sets.map((s) => {
            return {
              ...s,
              checked: false,
            };
          });

          this.exerciseClocks.push({
            rep: {
              type: 'setRep',
              opts: {
                set: repSets.length,
                currentSet: 0,
                sets: repSets as any,
              },
            },
            clock: {
              id: index,
              rest: false,
              mode: 'timer',
              max: this.restTime,
              current: this.restTime,
            },
            exercise: exercise,
          });
        }

        if (setType === 'weightTime') {
          // There will be multiple clocks for each set
          // Each clock will be timer, starting trom `time` down to 0
          const timeSets = exercise.set.sets.map((s) => {
            return {
              ...s,
              checked: false,
            };
          });

          const current = exercise.set.sets[0];
          clockTime = current.rep; // seconds

          if (setDetail.repUnit === 'min') {
            clockTime = current.rep * 60;
          }

          this.exerciseClocks.push({
            rep: {
              type: 'setTime',
              opts: {
                set: timeSets.length,
                currentSet: 0,
                sets: timeSets as any,
              },
            },
            clock: {
              id: index,
              rest: false,
              mode: 'timer',
              max: clockTime,
              current: clockTime,
            },
            exercise: exercise,
          });
        }

        if (setType === 'distanceTime') {
          // There will be single clock for the time
          // The clock will be timer
          const set = exercise.set.sets[0];
          time = set.rep;
          unit = setDetail.repUnit as any;

          clockTime = this.convertTimeToSec(time, unit);

          this.exerciseClocks.push({
            rep: {
              type: 'time',
              opts: {
                time: time,
                unit: unit,
              },
            },
            clock: {
              id: index,
              rest: false,
              mode: 'timer',
              max: clockTime,
              current: clockTime,
            },
            exercise: exercise,
          });
        }
      });

      // Add 'next' field of each exercise
      for (let i = 0; i < this.exerciseClocks.length - 1; i++) {
        this.exerciseClocks[i].next = this.exerciseClocks[i + 1].exercise.name;
      }
    });
  }

  ionViewWillLeave() {
    this.stopTraining();
  }

  convertTimeToSec(time: number, unit: 'min' | 'sec') {
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

    switch (currentExercise.rep.type) {
      case 'setRep':
        if (currentExercise.clock.rest) {
          this.startClock(currentExercise.clock.id);
        }
        break;
      case 'setTime':
        this.startClock(currentExercise.clock.id);
        break;
      case 'time':
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
      switch (nextExercise.rep.type) {
        case 'setRep':
          nextExercise.clock.rest = false;
          break;
        case 'setTime':
          this.startClock(nextExercise.clock.id);
          break;
        case 'time':
          this.startClock(nextExercise.clock.id);
          break;
        default:
          break;
      }
    }

    this.currentIndex = nextIndex;
  }

  slideNextIfFinished(exercise: ExerciseClock) {
    const { set, currentSet } = (exercise.rep as CSetRep | CSetTime).opts;
    if (currentSet >= set) {
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
    const opts = (exercise.rep as CSetRep).opts;
    const checked = opts.sets[index].checked;
    const set = opts.set;
    if (!checked) {
      // Update checkboxes
      opts.sets[index].checked = true;
      const nextIndex = Math.min(index + 1, set);
      opts.currentSet = nextIndex;
      for (let i = 0; i < index; i++) {
        opts.sets[i].checked = true;
      }

      // Display Rest Clock
      exercise.clock.rest = true;

      if (!this.trainingStarted) {
        // Start training if not started yet
        this.startTraining();
      }

      this.startClock(exercise.clock.id);
    } else {
      // Update checkboxes
      opts.currentSet = index;
      for (let i = index; i < set; i++) {
        opts.sets[i].checked = false;
      }
    }
  }

  /** Set-Time Controllers */
  onPreviousSet(exercise: ExerciseClock) {
    const opts = (exercise.rep as CSetTime).opts;
    const prevSet = Math.max(opts.currentSet - 1, 0);
    opts.currentSet = prevSet;

    // Reset
    exercise.clock.rest = false;
    this.resetClock(exercise.clock.id);
  }

  /**
   * Switches set to rest
   */
  onNextSet(exercise: ExerciseClock) {
    const opts = (exercise.rep as CSetTime).opts;
    opts.currentSet = opts.currentSet + 1;

    // Switch to rest
    exercise.clock.rest = true;
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
    switch (exercise.rep.type) {
      case 'setRep':
        this.stopClock(exercise.clock.id);
        exercise.clock.rest = false;
        this.slideNextIfFinished(exercise);
        break;
      case 'setTime':
        const opts = (exercise.rep as CSetTime).opts;
        // Try to slide next exercise
        const slided = this.slideNextIfFinished(exercise);
        // If slide happened, go back to first set
        if (slided) {
          opts.currentSet = 0;
        }
        // Switch to set
        exercise.clock.rest = false;
        // Update clock to set time
        const time = opts.sets[opts.currentSet].time;
        const unit = opts.sets[opts.currentSet].unit;
        const clockTime = this.convertTimeToSec(time, unit);
        this.updateClockMax(exercise.clock.id, clockTime);
        break;
      case 'time':
        this.stopClock(exercise.clock.id);
        // Switch to set
        exercise.clock.rest = false;
        // Update clock to set time
        const exerciseTime = this.convertTimeToSec(
          exercise.rep.opts.time,
          exercise.rep.opts.unit
        );
        this.updateClockMax(exercise.clock.id, exerciseTime);
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
  getWeight(exercise: ExerciseClock, setIndex: number) {
    const set = exercise.exercise.set.sets[setIndex];
    const setDetails = getSetDetail(exercise.exercise);
    return `${set.load} ${setDetails.loadUnit}`;
  }

  getCurrentSet(exercise: ExerciseClock) {
    const opts = (exercise.rep as CSetTime | CSetRep).opts;
    return Math.min(opts.currentSet + 1, opts.set);
  }
}
