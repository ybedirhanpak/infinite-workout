import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { Workout } from '@models/workout.model';

// Service
import { WorkoutService } from '@services/workout.service';

// Data
import WORKOUT from '../../../data/workout.json';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.page.html',
  styleUrls: ['./workouts.page.scss'],
})
export class WorkoutsPage {

  myWorkouts = WORKOUT as Workout[];
  favoriteWorkouts = WORKOUT as Workout[];

  constructor(private workoutService: WorkoutService, private router: Router) {}

  onWorkoutClick(workout: Workout) {
    this.workoutService.setWorkoutDetail(workout);
    this.router.navigateByUrl('/home/explore/workout-detail');
  }
}
