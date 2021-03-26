import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { Exercise, ExerciseCategory } from '@models/exercise.model';

// Service
import { ExerciseService } from '@services/exercise.service';

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
    const grouped = {};
    this.exercises.map((exercise) => {
      if (grouped[exercise.category]) {
        grouped[exercise.category].exercises.push(exercise);
      } else {
        grouped[exercise.category] = {
          category: exercise.category,
          exercises: [exercise],
        };
      }
    });
    this.exerciseCategories = Object.values(grouped);
  }

  onExerciseClick(exercise: Exercise) {
    this.exerciseService.setExerciseDetail(exercise);
    const navigateUrl = `${this.router.url}/exercise-detail`;
    this.router.navigateByUrl(navigateUrl);
  }
}
