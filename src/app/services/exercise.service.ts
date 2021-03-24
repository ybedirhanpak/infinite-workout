import { Injectable } from '@angular/core';
import { Exercise } from '@models/exercise.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private _exerciseDetail = new BehaviorSubject<Exercise>(null);

  get exerciseDetail() {
    return this._exerciseDetail.asObservable();
  }

  public setExerciseDetail(exercise: Exercise) {
    this._exerciseDetail.next(exercise);
  }
}
