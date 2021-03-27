import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { Workout } from '@models/workout.model';

// Service
import { WorkoutService } from '@services/workout.service';

// Data
import WORKOUT_LIST from '../../data/workout.json';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.page.html',
  styleUrls: ['./workouts.page.scss'],
})
export class WorkoutsPage {
  workoutList: Workout[] = WORKOUT_LIST as any;

  constructor(private workoutService: WorkoutService, private router: Router) {}

  onWorkoutClick(workout: Workout) {
    this.workoutService.workoutDetail.set(workout);
    this.router.navigateByUrl('/workout-detail');
  }
}
