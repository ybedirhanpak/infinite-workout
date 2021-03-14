import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';

// Model
import { Workout } from '@models/workout.model';
import { LocalListData } from '../utils/local-list-data';

// Storage Keys
const FAVORITE_WORKOUTS_KEY = 'FAVORITE_WORKOUTS';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private _workoutDetail = new BehaviorSubject<Workout>(null);

  private favoriteWorkouts: LocalListData<Workout[]>;

  constructor(storage: Storage) {
    this.favoriteWorkouts = new LocalListData(storage, FAVORITE_WORKOUTS_KEY);
  }

  get favorites() {
    return this.favoriteWorkouts.data;
  }

  public fetchFavorites() {
    return this.favoriteWorkouts.fetchData();
  }

  public addToFavorites(workout: Workout) {
    return this.favoriteWorkouts.addToList(workout);
  }

  public isFavorite(workout: Workout) {
    return this.favoriteWorkouts.contains(workout);
  }

  public deleteFromFavorites(workout: Workout) {
    return this.favoriteWorkouts.deleteFromList(workout);
  }

  get workoutDetail() {
    return this._workoutDetail.asObservable();
  }

  public setWorkoutDetail(workout: Workout) {
    this._workoutDetail.next(workout);
  }
}
