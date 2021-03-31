import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { Workout, WorkoutCategory } from '@models/workout.model';

// Service
import { WorkoutService } from '@services/workout.service';

// Util
import { groupBy } from '@utils/object.util';
import { getEmptyWorkout } from '@utils/workout.util';

const EMPTY_WORKOUT = getEmptyWorkout(Date.now());

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.page.html',
  styleUrls: ['./workouts.page.scss'],
})
export class WorkoutsPage implements OnInit {
  loading = false;
  workoutList: Workout[];
  workoutCategories: WorkoutCategory[];

  constructor(private workoutService: WorkoutService, private router: Router) {}

  onWorkoutClick(workout: Workout) {
    this.workoutService.workoutDetail.set(workout);
    this.router.navigateByUrl('/workout-detail');
  }

  ngOnInit() {
    this.loading = true;
    this.workoutService.remoteWorkouts.get().subscribe((workouts) => {
      this.workoutService.workouts
        .loadLocalStates(workouts as any)
        .then((workouts: Workout[]) => {
          this.workoutList = workouts;
          this.workoutCategories = groupBy(
            workouts,
            'workouts',
            'category'
          ) as any;
        })
        .finally(() => {
          this.loading = false;
        });
    });
  }

  ionViewWillEnter() {
    this.workoutService.fetchWorkouts();
  }

  identifyWorkout(index: number, item: Workout) {
    return item.id ?? index;
  }
}
