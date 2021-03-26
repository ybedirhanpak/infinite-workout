import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

// Model
import { Workout } from '@models/workout.model';
import { LocalList } from '../utils/local-list.util';
import { State } from '@utils/state.util';

// Storage Keys
const FAVORITE_WORKOUTS_KEY = 'FAVORITE_WORKOUTS';
const CREATED_WORKOUTS_KEY = 'CREATED_WORKOUTS';


@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  public workoutDetail = new State<Workout>(null);

  public favoriteWorkouts: LocalList<Workout[]>;
  public createdWorkouts: LocalList<Workout[]>;

  constructor(storage: Storage) {
    this.favoriteWorkouts = new LocalList(storage, FAVORITE_WORKOUTS_KEY);
    this.createdWorkouts = new LocalList(storage, CREATED_WORKOUTS_KEY);
  }
}
