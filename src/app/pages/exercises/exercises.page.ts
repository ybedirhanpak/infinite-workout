import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { Exercise, ExerciseCategory } from '@models/exercise.model';

// Service
import { ExerciseService } from '@services/exercise.service';

// Data
import EXERCISE_CATEGORIES from '../../data/exercise.json';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.page.html',
  styleUrls: ['./exercises.page.scss'],
})
export class ExercisesPage {

  exerciseCategories: ExerciseCategory[] = EXERCISE_CATEGORIES;

  constructor(private exerciseService: ExerciseService, private router: Router) {}

  onExerciseClick(exercise: Exercise) {
    this.exerciseService.setExerciseDetail(exercise);
    const navigateUrl = `${this.router.url}/exercise-detail`;
    this.router.navigateByUrl(navigateUrl);
  }
}
