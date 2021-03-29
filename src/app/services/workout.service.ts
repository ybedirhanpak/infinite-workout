import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';

// Model
import { Workout } from '@models/workout.model';

// Utils
import { LocalList } from '@utils/local-list.util';
import { State } from '@utils/state.util';

// Storage Keys
const WORKOUTS_KEY = 'WORKOUTS';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  public workoutDetail = new State<Workout>(null);
  public workoutEdit = new State<Workout>(null);

  public workouts: LocalList<Workout[]>;

  constructor(storage: Storage) {
    this.workouts = new LocalList(storage, WORKOUTS_KEY);
  }

  get favorites$() {
    return this.workouts.elements.pipe(
      map((workouts) => {
        return workouts.filter((workout) => workout.state?.favorited);
      })
    );
  }

  get createdWorkouts$() {
    return this.workouts.elements.pipe(
      map((workouts) => {
        return workouts.filter((workout) => workout.state?.created);
      })
    );
  }

  get customizedWorkouts$() {
    return this.workouts.elements.pipe(
      map((workouts) => {
        return workouts.filter((workout) => workout.state?.customized);
      })
    );
  }

  async saveFavorite(workout: Workout) {
    workout.state = {
      ...workout.state,
      favorited: true,
    };

    if (workout.state?.created || workout.state?.customized) {
      return this.workouts.update(workout);
    }

    return this.workouts.create({ ...workout });
  }

  async removeFavorite(workout: Workout) {
    workout.state = {
      ...workout.state,
      favorited: false,
    };

    if (workout.state?.created || workout.state?.customized) {
      return this.workouts.update(workout);
    }

    // Workouts that has been favorited but not customized nor created
    return this.workouts.remove(workout);
  }

  async customizeWorkout(workout: Workout) {
    workout.id = Date.now();
    workout.state = {
      ...workout.state,
      customized: true,
      favorited: false,
    };
    return this.workouts.create(workout);
  }

  async createWorkout(workout: Workout) {
    workout.id = Date.now();
    workout.state = {
      ...workout.state,
      created: true,
    };
    return this.workouts.create(workout);
  }

  async editWorkout(workout: Workout) {
    return this.workouts.update(workout);
  }

  async deleteWorkout(workout: Workout) {
    return this.workouts.remove(workout);
  }
}
