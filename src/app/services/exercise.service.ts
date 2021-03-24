import { Injectable } from '@angular/core';
import { Exercise } from '@models/exercise.model';
import { WorkoutExercise } from '@models/workout.model';
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

  private _editedExercise = new BehaviorSubject<WorkoutExercise>(null);

  get editedExercise() {
    return this._editedExercise.asObservable();
  }

  public setEditedExercise(exercise: WorkoutExercise) {
    this._editedExercise.next(exercise);
  }
}
