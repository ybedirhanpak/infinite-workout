import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Workout, WorkoutExercise } from '@models/workout.model';
import { ExerciseService } from '@services/exercise.service';

@Component({
  selector: 'app-create-edit-workout',
  templateUrl: './create-edit-workout.page.html',
  styleUrls: ['./create-edit-workout.page.scss'],
})
export class CreateEditWorkoutPage implements OnInit {

  mode: 'create' | 'edit' = 'create';
  title = 'Create Workout';
  workout: Workout;

  exercises: WorkoutExercise[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private exerciseService: ExerciseService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      if(params.has("id")) {
        // Edit Mode
        this.title = 'Edit Workout';
      } else {
        // Create Mode
      }
    });
  }

  ionViewWillEnter() {
    this.exerciseService.editedExercise.subscribe((exercise) => {
      if(exercise && !this.exercises.find(e => e.id === exercise.id)) {
        this.exercises.push(exercise);
      }
    });
  }

  async onAddExerciseClick() {
    const navigateUrl = `${this.router.url}/exercises`;
    this.router.navigateByUrl(navigateUrl);
  }
}
