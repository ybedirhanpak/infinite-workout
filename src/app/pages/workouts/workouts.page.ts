import { Component, OnInit } from '@angular/core';
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
export class WorkoutsPage implements OnInit {
  workoutList: Workout[];
  workoutCategories: WorkoutCategory[];

  constructor(private workoutService: WorkoutService, private router: Router) {}

  onWorkoutClick(workout: Workout) {
    this.workoutService.workoutDetail.set(workout);
    this.router.navigateByUrl('/workout-detail');
  }

  ngOnInit() {
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
