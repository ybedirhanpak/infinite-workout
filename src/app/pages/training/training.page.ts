import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';

// Model
import {
  getLoadString,
  Workout,
  SetRep,
  Time,
  SetTime,
} from '@models/workout.model';

// Service
import { DateService } from '@services/date.service';
import { WorkoutService } from '@services/workout.service';

// Date
import WORKOUTS from '../../data/workout.json';

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
  disabled: boolean;
  mode: 'timer' | 'stopwatch';
  reset: boolean;
  pause: boolean;
  max: number;
  current: number;
}

interface ExerciseClock {
  name: string;
  imageUrl: string;
  load?: string;
  rep: CSetRep | CTime | CSetTime;
  clock: Clock;
  next?: string;
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
    slidesPerView: 1.4,
    centeredSlides: true,
  };

  slideLoaded = false;

  /** Rest */
  restTime = 90; // seconds

  rest: ExerciseClock = {
    name: 'Rest',
    imageUrl:
      'https://images.unsplash.com/photo-1569535188944-249671c96238?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
    rep: {
      type: 'time',
      opts: {
        time: this.restTime,
        unit: 'sec',
      },
    },
    clock: {
      disabled: false,
      mode: 'timer',
      reset: true,
      pause: true,
      max: this.restTime,
      current: this.restTime,
    },
  };

  /** Training */
  trainingStarted: boolean;
  trainingPaused: boolean;
  totalTime: number;
  totalTimeString: string;
  totalTimeInterval: NodeJS.Timeout;

  workout: Workout;
  exerciseClocks: ExerciseClock[];
  currentExercise: ExerciseClock;
  currentIndex: number;

  constructor(
    private dateService: DateService,
    private workoutService: WorkoutService,
    private router: Router
  ) {}

  ngOnInit() {
    this.workoutService.setWorkoutDetail(WORKOUTS[5] as Workout);
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

    this.workoutService.workoutDetail.subscribe((workout) => {
      this.workout = workout;

      // Create exercise clocks
      this.workout.exercises.forEach((exercise) => {
        const load = getLoadString(exercise);
        let set = 0;
        let time = 0;
        let unit: 'min' | 'sec' = 'sec';
        let clockTime = 0;

        switch (exercise.rep.type) {
          case 'setRep':
            // There will be multiple clocks for each set
            // Each clock will be stopwatch starting from 0 up to 2 mins
            set = exercise.rep.opts.set;

            const repSets = exercise.rep.opts.sets.map((s) => {
              return {
                ...s,
                checked: false,
              };
            });

            this.exerciseClocks.push({
              name: exercise.name,
              imageUrl: exercise.imageUrl,
              load: load,
              rep: {
                type: 'setRep',
                opts: {
                  set: set,
                  currentSet: 0,
                  sets: repSets as any,
                },
              },
              clock: {
                disabled: true,
                mode: 'stopwatch',
                reset: true,
                pause: true,
                max: 120,
                current: 115,
              },
            });

            // this.exerciseClocks.push(this.rest);
            break;
          case 'time':
            // There will be single clock for the time
            // The clock will be timer
            time = exercise.rep.opts.time;
            unit = exercise.rep.opts.unit;
            if (unit === 'min') {
              clockTime = time * 60;
            }
            if (unit === 'sec') {
              clockTime = time;
            }
            this.exerciseClocks.push({
              name: exercise.name,
              imageUrl: exercise.imageUrl,
              load: load,
              rep: {
                type: 'time',
                opts: {
                  time: time,
                  unit: unit,
                },
              },
              clock: {
                disabled: false,
                mode: 'timer',
                reset: true,
                pause: true,
                max: clockTime,
                current: 0,
              },
            });
            break;
          case 'setTime':
            // There will be multiple clocks for each set
            // Each clock will be timer, starting trom `time` down to 0
            set = exercise.rep.opts.set;

            const timeSets = exercise.rep.opts.sets.map((s) => {
              return {
                ...s,
                checked: false,
              };
            });

            const current = exercise.rep.opts.sets[0];

            if (current.unit === 'min') {
              clockTime = time * 60;
            }
            if (current.unit === 'sec') {
              clockTime = time;
            }

            this.exerciseClocks.push({
              name: exercise.name,
              imageUrl: exercise.imageUrl,
              load: load,
              rep: {
                type: 'setTime',
                opts: {
                  set: set,
                  currentSet: 0,
                  sets: timeSets as any,
                },
              },
              clock: {
                disabled: false,
                mode: 'timer',
                reset: true,
                pause: true,
                max: clockTime,
                current: 0,
              },
            });
            // this.exerciseClocks.push(this.rest);
            break;
          default:
            break;
        }
      });

      // Add 'next' field of each exercise
      for (let i = 0; i < this.exerciseClocks.length - 1; i++) {
        this.exerciseClocks[i].next = this.exerciseClocks[i + 1].name;
      }

      // Start from the first exercise
      this.currentExercise = this.exerciseClocks[0];
    });
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
   * Starts time of the training and clock of current index
   */
  async startTime() {
    // Start clock
    const index = await this.slides.getActiveIndex();
    this.startClock(index);
    this.updateCurrentExercise(index);

    // Start total time
    this.totalTimeInterval = setInterval(() => {
      this.totalTimeTick();
    }, 1000);
  }

  async onSlideLoad(event: any) {
    this.slideLoaded = true;
    if (this.trainingStarted && !this.trainingPaused) {
      this.startTime();
    }
  }

  async onSlideChange(event: any) {
    const nextIndex = await this.slides.getActiveIndex();
    if (!this.trainingPaused) {
      this.resetClock(this.currentIndex);
      this.startClock(nextIndex);
    }
    this.updateCurrentExercise(nextIndex);
  }

  updateCurrentExercise(index: number) {
    this.currentIndex = index;
    this.currentExercise = this.exerciseClocks[this.currentIndex];
  }

  startClock(index: number) {
    this.exerciseClocks[index].clock.reset = false;
    this.exerciseClocks[index].clock.pause = false;
  }

  pauseClock(index: number) {
    this.exerciseClocks[index].clock.pause = true;
  }

  resetClock(index: number) {
    this.exerciseClocks[index].clock.reset = true;
    this.exerciseClocks[index].clock.pause = true;
  }

  startTraining() {
    this.trainingStarted = true;
    this.trainingPaused = false;
    this.startTime();
  }

  onFooterButtonClick() {
    if (!this.trainingStarted) {
      if (this.slideLoaded) {
        this.startTraining();
      } else {
        // Display error message
      }
      return;
    }

    if (this.trainingPaused) {
      // Resume
      this.startTime();
      this.trainingPaused = false;
    } else {
      // Pause
      this.pauseClock(this.currentIndex);
      this.trainingPaused = true;
    }
  }

  getSetText(exercise: ExerciseClock, index: number) {
    if ((exercise.rep as CSetRep).opts.sets[index].checked) {
      return 'Done';
    }

    return 'Did it';
  }

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
      exercise.clock.disabled = false;
    } else {
      // Update checkboxes
      opts.currentSet = index;
      for (let i = index; i < set; i++) {
        opts.sets[i].checked = false;
      }
    }
  }

  getRestText(exercise: ExerciseClock) {
    if(exercise.clock.reset) {
      return 'Start';
    }
    return 'Reset';
  }

  onRestReset(event: any, exercise: ExerciseClock, index: number) {
    if(exercise.clock.reset) {
      exercise.clock.reset = false;
      exercise.clock.pause = false;
    } else {
      exercise.clock.reset = true;
      exercise.clock.pause = true;
    }
  }

  slideNextIfFinished(exercise: ExerciseClock) {
    const { set, currentSet } = (exercise.rep as CSetRep).opts;
    if(currentSet >= set) {
      // Go to the next exercise
      this.slides.slideNext();
    }
  }

  onRestSkip(event: any, exercise: ExerciseClock, index: number) {
    exercise.clock.disabled = true;
    this.slideNextIfFinished(exercise);
  }

  onRestFinish(finished: boolean, exercise: ExerciseClock, index: number) {
    if(finished) {
      exercise.clock.disabled = true;
      this.slideNextIfFinished(exercise);
    }
  }

  finishTraining() {
    this.router.navigate(['/home/']);
  }
}
