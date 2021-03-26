import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Model
import { Exercise } from '@models/exercise.model';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private _exerciseDetail = new BehaviorSubject<Exercise>(null);

  get exerciseDetail() {
    return this._exerciseDetail.asObservable();
  }

  public setExerciseDetail(exercise: Exercise) {
    this._exerciseDetail.next(exercise);
  }

  private _editedExercise = new BehaviorSubject<Exercise>(null);

  get editedExercise() {
    return this._editedExercise.asObservable();
  }

  public setEditedExercise(exercise: Exercise) {
    this._editedExercise.next(exercise);
  }
}
