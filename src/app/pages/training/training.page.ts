import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';

// Model
import { getLoadString, Workout } from '@models/workout.model';

// Service
import { DateService } from '@services/date.service';
import { WorkoutService } from '@services/workout.service';

// Exercise card types

interface SetRep {
  type: 'setRep';
  opts: {
    set: number;
    currentSet: number;
    rep: number;
  };
}

interface Time {
  type: 'time';
  opts: {
    time: number;
    unit: 'min' | 'sec';
  };
}

interface SetTime {
  type: 'setTime';
  opts: {
    set: number;
    currentSet: number;
    repTime: string;
  };
}

interface Clock {
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
  rep: SetRep | Time | SetTime;
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

  ngOnInit() {}

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
        let rep = 0;
        let set = 0;
        let time = 0;
        let unit: 'min' | 'sec' = 'sec';
        let clockTime = 0;

        switch (exercise.rep.type) {
          case 'setRep':
            // There will be multiple clocks for each set
            // Each clock will be stopwatch starting from 0 up to 2 mins
            rep = exercise.rep.opts.rep;
            set = exercise.rep.opts.set;

            for (let i = 1; i <= set; i++) {
              this.exerciseClocks.push({
                name: exercise.name,
                imageUrl: exercise.imageUrl,
                load: load,
                rep: {
                  type: 'setRep',
                  opts: {
                    rep: rep,
                    set: set,
                    currentSet: i,
                  },
                },
                clock: {
                  mode: 'stopwatch',
                  reset: true,
                  pause: true,
                  max: 120,
                  current: 0,
                },
              });
              this.exerciseClocks.push(this.rest);
            }
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
            time = exercise.rep.opts.time;
            unit = exercise.rep.opts.unit;
            if (unit === 'min') {
              clockTime = time * 60;
            }
            if (unit === 'sec') {
              clockTime = time;
            }
            for (let i = 1; i <= set; i++) {
              this.exerciseClocks.push({
                name: exercise.name,
                imageUrl: exercise.imageUrl,
                load: load,
                rep: {
                  type: 'setTime',
                  opts: {
                    repTime: `${time} ${unit}`,
                    set: set,
                    currentSet: i,
                  },
                },
                clock: {
                  mode: 'timer',
                  reset: true,
                  pause: true,
                  max: clockTime,
                  current: 0,
                },
              });
              this.exerciseClocks.push(this.rest);
            }
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

  finishTraining() {
    this.router.navigate(['/home/']);
  }
}
