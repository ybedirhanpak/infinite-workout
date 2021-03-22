import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { Workout } from '@models/workout.model';

// Data
import WORKOUT from '../../data/workout.json';
import { WorkoutService } from '@services/workout.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage {
  myWorkouts = WORKOUT as Workout[];
  favoriteWorkouts = WORKOUT as Workout[];

  constructor(private workoutService: WorkoutService, private router: Router) {}

  onWorkoutsClick() {
    this.router.navigateByUrl('/home/explore/workouts');
    console.log("clicked");
  }

  onExercisesClick() {
    this.router.navigateByUrl('/home/explore/exercises');
  }
}
