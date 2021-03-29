import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { Workout, WorkoutCategory } from '@models/workout.model';

// Service
import { WorkoutService } from '@services/workout.service';
import { groupBy } from '@utils/object.util';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.page.html',
  styleUrls: ['./workouts.page.scss'],
})
export class WorkoutsPage {
  workoutList: Workout[];
  workoutCategories: WorkoutCategory[];

  constructor(private workoutService: WorkoutService, private router: Router) {}

  onWorkoutClick(workout: Workout) {
    this.workoutService.workoutDetail.set(workout);
    this.router.navigateByUrl('/workout-detail');
  }

  ionViewWillEnter() {
    this.workoutService.fetchWorkouts().then((workouts) => {
      console.log('Workouts', workouts);
      this.workoutService.workouts
        .loadLocalStates(workouts as any)
        .then((workouts: Workout[]) => {
          this.workoutList = workouts;
          this.workoutCategories = groupBy(
            workouts,
            'workouts',
            'category'
          ) as any;
        });
    });
  }
}
