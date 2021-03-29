import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { Exercise, ExerciseCategory } from '@models/exercise.model';

// Service
import { ExerciseService } from '@services/exercise.service';
import { groupBy } from '@utils/object.util';

// Data
import EXERCISES from '../../data/exercise.json';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.page.html',
  styleUrls: ['./exercises.page.scss'],
})
export class ExercisesPage {
  exerciseCategories: ExerciseCategory[] = [];
  exercises: Exercise[] = EXERCISES as Exercise[];

  constructor(
    private exerciseService: ExerciseService,
    private router: Router
  ) {
    this.exerciseCategories = groupBy(this.exercises, 'exercises', 'category') as any;
  }

  onExerciseClick(exercise: Exercise) {
    this.exerciseService.exerciseDetail.set(exercise);
    const navigateUrl = `${this.router.url}/exercise-detail`;
    this.router.navigateByUrl(navigateUrl);
  }
}
