import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, of, from } from 'rxjs';
import { Workout, ExerciseRecord } from './workout.model';
import { take, tap, delay, switchMap, map } from 'rxjs/operators';

const WORKOUT_KEY = 'WORKOUT';
const REST_TIME_KEY = 'REST_TIME_KEY';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private _workoutList = new BehaviorSubject<Workout[]>([]);
  private _restTime = new BehaviorSubject<number>(0);

  get workoutList() {
    return this._workoutList.asObservable();
  }

  get restTime() {
    return this._restTime.asObservable();
  }

  constructor(private storage: Storage) {
    this.saveRestTime(120);
  }

  fetchWorkoutList() {
    return from(this.storage.get(WORKOUT_KEY)).pipe(
      map((workoutList) => {
        if (!workoutList || workoutList?.length <= 0) {
          return [];
        }
        return workoutList;
      }),
      tap((workoutList) => {
        this._workoutList.next(workoutList);
      })
    );
  }

  addWorkout(exercises: ExerciseRecord[], date: Date, totalTime: string) {
    const newWorkout = new Workout(Date.now(), exercises, date, totalTime);

    return from(this.storage.get(WORKOUT_KEY)).pipe(
      map((workoutList) => {
        if (!workoutList || workoutList?.length <= 0) {
          return [];
        }
        return workoutList;
      }),
      tap((workoutList: Workout[]) => {
        const updatedWorkoutList = workoutList.concat(newWorkout);
        this.storage.set(WORKOUT_KEY, updatedWorkoutList).then(() => {
          this._workoutList.next(updatedWorkoutList);
        });
      })
    );
  }

  deleteWorkout(id: number) {
    return from(this.storage.get(WORKOUT_KEY)).pipe(
      map((workoutList) => {
        if (!workoutList || workoutList?.length <= 0) {
          return [];
        }
        return workoutList;
      }),
      tap((workoutList: Workout[]) => {
        const updatedWorkoutList = workoutList.filter(
          (w: Workout) => w.id !== id
        );
        this.storage.set(WORKOUT_KEY, updatedWorkoutList).then(() => {
          this._workoutList.next(updatedWorkoutList);
        });
      })
    );
  }

  getWorkout(id: number) {
    return from(this.storage.get(WORKOUT_KEY)).pipe(
      map((workoutList) => {
        if (!workoutList || workoutList?.length <= 0) {
          return [];
        }
        return workoutList;
      }),
      switchMap((workoutList: Workout[]) => {
        const workout = workoutList.filter((w: Workout) => w.id === id)[0];
        return of(workout);
      })
    );
  }

  fetchRestTime() {
    this.storage.get(REST_TIME_KEY).then(value => {
      this._restTime.next(value);
    });
  }

  saveRestTime(restTime: number) {
    this.storage.set(REST_TIME_KEY, restTime).then(() => {
      this._restTime.next(restTime);
    });
  }
}
