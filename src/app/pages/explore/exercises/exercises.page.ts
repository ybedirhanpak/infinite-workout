import { Component } from '@angular/core';
import { Exercise, ExerciseCategory } from '@models/exercise.model';

// Data
import EXERCISE_CATEGORIES from '../../../data/exercise.json';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.page.html',
  styleUrls: ['./exercises.page.scss'],
})
export class ExercisesPage {

  exerciseCategories: ExerciseCategory[] = EXERCISE_CATEGORIES;

  onExerciseClick(exercise: Exercise) {
    console.log("Exercise click:", exercise);
  }
}
