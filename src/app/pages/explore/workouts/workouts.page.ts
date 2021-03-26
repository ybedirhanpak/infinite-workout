import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { Workout } from '@models/workout.model';

// Service
import { WorkoutService } from '@services/workout.service';
import { plainToClass } from 'class-transformer';

// Data
import WORKOUT from '../../../data/workout.json';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.page.html',
  styleUrls: ['./workouts.page.scss'],
})
export class WorkoutsPage {
  myWorkouts = plainToClass(Workout, WORKOUT);
  favoriteWorkouts = plainToClass(Workout, WORKOUT);

  constructor(private workoutService: WorkoutService, private router: Router) {}

  onWorkoutClick(workout: Workout) {
    this.workoutService.workoutDetail.set(workout);
    this.router.navigateByUrl('/home/explore/workout-detail');
  }
}
