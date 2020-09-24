import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, of, from } from 'rxjs';
import { Workout, ExerciseRecord } from '../models/workout.model';
import { take, tap, delay, switchMap, map } from 'rxjs/operators';

const WORKOUT_KEY = 'WORKOUT';
const REST_TIME_KEY = 'REST_TIME_KEY';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private WORKOUT_LIST = new BehaviorSubject<Workout[]>([]);
  private REST_TIME = new BehaviorSubject<number>(0);

  get workoutList() {
    return this.WORKOUT_LIST.asObservable();
  }

  get restTime() {
    return this.REST_TIME.asObservable();
  }

  constructor(private storage: Storage) {
    this.saveRestTime(120);
  }

  /**
   * Returns empty list if given workout list is null or empty
   * @param workoutList is the lis to be adjusted
   */
  private adjustWorkoutList(workoutList: Workout[]) {
    if (!workoutList || workoutList?.length <= 0) {
      return [];
    }
    return workoutList;
  }

  /**
   * Fetchs workout list from storage and updates behavior subject
   */
  async fetchWorkoutList() {
    const workoutList = await this.storage.get(WORKOUT_KEY);
    const adjustedList = this.adjustWorkoutList(workoutList);
    this.WORKOUT_LIST.next(adjustedList);
  }

  /**
   * Creates and saves workout record
   * @param exercises list of exercises executed in the workout
   * @param date date of execution of workout
   * @param totalTime amount of time passed through workout
   */
  async saveWorkout(exercises: ExerciseRecord[], date: Date, totalTime: string) {
    const newWorkout = new Workout(Date.now(), exercises, date, totalTime);
    const workoutList = await this.storage.get(WORKOUT_KEY);
    const adjustedList = this.adjustWorkoutList(workoutList);
    const updatedList = adjustedList.concat(newWorkout);
    await this.storage.set(WORKOUT_KEY, updatedList);
    this.WORKOUT_LIST.next(updatedList);
  }

  /**
   * Deletes workout from storage and behavior subject
   * @param id identifier of the workout to be deleted
   */
  async deleteWorkout(id: number) {
    const workoutList = await this.storage.get(WORKOUT_KEY);
    const adjustedList = this.adjustWorkoutList(workoutList);
    const updatedWorkoutList = adjustedList.filter(
      (w: Workout) => w.id !== id
    );
    await this.storage.set(WORKOUT_KEY, updatedWorkoutList);
    this.WORKOUT_LIST.next(updatedWorkoutList);
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
      this.REST_TIME.next(value);
    });
  }

  saveRestTime(restTime: number) {
    this.storage.set(REST_TIME_KEY, restTime).then(() => {
      this.REST_TIME.next(restTime);
    });
  }
}
