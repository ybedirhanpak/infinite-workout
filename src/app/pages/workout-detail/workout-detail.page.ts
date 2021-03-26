import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Exercise } from '@models/exercise.model';

// Model
import { Workout } from '@models/workout.model';
import { ExerciseService } from '@services/exercise.service';

// Service
import { WorkoutService } from '@services/workout.service';
import { copyFrom } from '@utils/object.util';
import { plainToClass } from 'class-transformer';

@Component({
  selector: 'app-workout-detail',
  templateUrl: './workout-detail.page.html',
  styleUrls: ['./workout-detail.page.scss'],
})
export class WorkoutDetailPage implements OnInit {
  @Input() workout: Workout;

  duration = '';
  explore = false;
  favorited = false;
  created = false;

  constructor(
    private workoutService: WorkoutService,
    private router: Router,
    private exerciseService: ExerciseService
  ) {}

  ngOnInit() {
    this.explore = this.router.url.includes('explore');
  }

  ionViewWillEnter() {
    this.workoutService.workoutDetail.get().subscribe(async (workout) => {
      this.workout = plainToClass(Workout, workout);
      this.favorited = await this.workoutService.favoriteWorkouts.contains(
        this.workout
      );
      this.created = await this.workoutService.createdWorkouts.contains(
        this.workout
      );
    });

    if(this.workout) {
      this.exerciseService.editedExercise.subscribe((exercise) => {
        if (exercise) {
          const oldExercise = this.workout.exercises.find(
            (e) => e.id === exercise.id
          );
          if (oldExercise) {
            copyFrom(exercise, oldExercise);
          } else {
            this.workout.exercises.push(exercise);
          }

          // Save workout into storage
          this.workoutService.favoriteWorkouts.update(this.workout);
        }
      });
    }
  }

  startWorkout() {
    this.router.navigateByUrl('/training');
    this.workoutService.workoutDetail.set(this.workout);
  }

  async onFavoriteClick() {
    if (!this.favorited) {
      await this.workoutService.favoriteWorkouts.create(this.workout);
    } else {
      await this.workoutService.favoriteWorkouts.remove(this.workout);
    }
    this.favorited = await this.workoutService.favoriteWorkouts.contains(
      this.workout
    );
  }

  async onEditClick() {
    this.router.navigateByUrl(
      `/home/my-library/edit-workout/${this.workout.id}`
    );
  }

  onEditExerciseClick(exercise: Exercise) {
    this.exerciseService.setExerciseDetail(exercise);
    const navigateUrl = `${this.router.url}/exercise-edit`;
    this.router.navigateByUrl(navigateUrl);
  }
}
