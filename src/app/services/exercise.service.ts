import { Injectable } from '@angular/core';

// Model
import { Exercise } from '@models/exercise.model';
import { State } from '@utils/state.util';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  public editedExercise = new State<Exercise | null>(null);
  public exerciseDetail = new State<Exercise | null>(null);
}
