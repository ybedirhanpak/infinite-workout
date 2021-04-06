import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';

// Model
import { Workout, WorkoutCategory } from '@models/workout.model';

// Utils
import { LocalList } from '@utils/local-list.util';
import { State } from '@utils/state.util';
import { groupBy } from '@utils/object.util';

// Storage Keys
const WORKOUTS_KEY = 'WORKOUTS';

const BASE_URL = 'https://infinite-workout-2d736-default-rtdb.firebaseio.com/';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  public remoteWorkouts = new State<Workout[]>([]);
  public workoutCategories = new State<WorkoutCategory[]>([]);

  public workoutDetail = new State<Workout>(null);
  public workoutEdit = new State<Workout>(null);

  public workouts: LocalList<Workout[]>;

  constructor(storage: Storage, private http: HttpClient) {
    this.workouts = new LocalList(storage, WORKOUTS_KEY);
  }

  get favorites$() {
    return this.workouts.elements.pipe(
      map((workouts) => {
        return workouts
          .filter((workout) => workout.state?.favorited)
          .sort((w1, w2) => {
            if (w1.state?.favoriteDate && w2.state?.favoriteDate) {
              return w2.state.favoriteDate - w1.state.favoriteDate;
            }

            return w2.id - w1.id;
          });
      })
    );
  }

  get createdWorkouts$() {
    return this.workouts.elements.pipe(
      map((workouts) => {
        return workouts
          .filter((workout) => workout.state?.created)
          .sort((w1, w2) => w2.id - w1.id);
      })
    );
  }

  get customizedWorkouts$() {
    return this.workouts.elements.pipe(
      map((workouts) => {
        return workouts
          .filter((workout) => workout.state?.customized)
          .sort((w1, w2) => w2.id - w1.id);
      })
    );
  }

  async saveFavorite(workout: Workout) {
    workout.state = {
      ...workout.state,
      favorited: true,
      favoriteDate: Date.now(),
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
      favoriteDate: undefined,
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

  fetchWorkouts() {
    return this.http
      .get<{ [key: string]: Workout }>(`${BASE_URL}/workout.json`)
      .pipe(
        concatMap((workoutsData) => {
          if (workoutsData) {
            const workouts = Object.values(workoutsData);
            workouts.sort((w1, w2) => w2.id - w1.id);
            return from(this.workouts.loadLocalStates(workouts));
          }
          return [];
        }),
        tap((workouts) => {
          this.workoutCategories.set(
            groupBy(workouts, 'workouts', 'category') as any
          );
        })
      )
      .subscribe((workouts) => {
        this.remoteWorkouts.set(workouts);
      });
  }

  async uploadWorkout(workout: Workout) {
    workout.state = undefined;
    workout.id = Date.now();

    return this.http
      .post<Workout>(`${BASE_URL}/workout.json`, workout)
      .toPromise();
  }
}
