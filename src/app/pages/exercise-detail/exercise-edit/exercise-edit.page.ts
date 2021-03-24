import { Component, OnInit } from '@angular/core';

// Model
import { Exercise } from '@models/exercise.model';
import { WorkoutExercise } from '@models/workout.model';
import { ExerciseService } from '@services/exercise.service';


@Component({
  selector: 'app-exercise-edit',
  templateUrl: './exercise-edit.page.html',
  styleUrls: ['./exercise-edit.page.scss'],
})
export class ExerciseEditPage implements OnInit {

  exercise: Exercise
  savedExercise: WorkoutExercise

  constructor(private exerciseService: ExerciseService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.exerciseService.exerciseDetail.subscribe((exercise) => {
      this.exercise = exercise; 
    })
  }

}
