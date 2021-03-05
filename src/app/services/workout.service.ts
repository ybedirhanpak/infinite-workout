import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Workout } from '@models/workout.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  private _workoutDetail = new BehaviorSubject<Workout>(null);

  get workoutDetail() {
    return this._workoutDetail.asObservable();
  }

  public setWorkoutDetail(workout: Workout) {
    this._workoutDetail.next(workout);
  }

  constructor() { }
}
