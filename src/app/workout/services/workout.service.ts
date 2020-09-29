import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { Workout, ExerciseRecord } from '../models/workout.model';

// Keys
const WORKOUT_KEY = 'WORKOUT';
const REST_TIME_KEY = 'REST_TIME_KEY';

// Defaults
const REST_TIME_DEFAULT = 90;

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
    const workoutList = this.adjustWorkoutList(
      await this.storage.get(WORKOUT_KEY)
    );
    this.WORKOUT_LIST.next(workoutList);
  }

  /**
   * Creates and saves workout record
   * @param exercises list of exercises executed in the workout
   * @param date date of execution of workout
   * @param totalTime amount of time passed through workout
   */
  async saveWorkout(
    exercises: ExerciseRecord[],
    date: Date,
    totalTime: string
  ) {
    const newWorkout = new Workout(Date.now(), exercises, date, totalTime);
    const workoutList = this.adjustWorkoutList(
      await this.storage.get(WORKOUT_KEY)
    );
    const updatedList = workoutList.concat(newWorkout);
    await this.storage.set(WORKOUT_KEY, updatedList);
    this.WORKOUT_LIST.next(updatedList);
  }

  /**
   * Deletes workout from storage and behavior subject
   * @param id identifier of the workout to be deleted
   */
  async deleteWorkout(id: number) {
    const workoutList = this.adjustWorkoutList(
      await this.storage.get(WORKOUT_KEY)
    );
    const updatedList = workoutList.filter((w: Workout) => w.id !== id);
    await this.storage.set(WORKOUT_KEY, updatedList);
    this.WORKOUT_LIST.next(updatedList);
  }

  /**
   * Retrevies workout from workout list
   * @param id identifier of workout to be retreived
   */
  async getWorkout(id: number) {
    const workoutList = this.adjustWorkoutList(
      await this.storage.get(WORKOUT_KEY)
    );
    const workout = workoutList.filter((w: Workout) => w.id === id)[0];
    return workout;
  }

  /**
   * Retrevies rest time from storage and updates behavior subject
   */
  async fetchRestTime() {
    let restTime = await this.storage.get(REST_TIME_KEY);
    // If rest time is undefined or null, make it default value
    if (restTime !== 0 && !restTime) {
      await this.storage.set(REST_TIME_KEY, REST_TIME_DEFAULT);
      restTime = REST_TIME_DEFAULT;
    }
    // If rest time is changed, update it
    if (restTime !== this.REST_TIME.value) {
      this.REST_TIME.next(restTime);
    }
  }

  /**
   * Saves resttime into storage and behavior subject
   * @param restTime new value of restTime to be saved
   */
  async saveRestTime(restTime: number) {
    await this.storage.set(REST_TIME_KEY, restTime);
    this.REST_TIME.next(restTime);
  }
}
