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

  refresher: any;

  constructor(private workoutService: WorkoutService, private router: Router) {}

  onWorkoutClick(workout: Workout) {
    this.workoutService.workoutDetail.set(workout);
    this.router.navigateByUrl('/workout-detail');
  }

  ngOnInit() {
    this.workoutService.fetchWorkouts();

    this.loading = true;
    this.workoutService.remoteWorkouts.get().subscribe((workouts) => {
      this.workoutList = workouts;
      this.loading = false;
      if (this.refresher) {
        this.refresher.complete();
      }
    });

    this.workoutService.workoutCategories
      .get()
      .subscribe((workoutCategories) => {
        this.workoutCategories = workoutCategories;
      });
  }

  ionViewWillEnter() {
    this.workoutService.workouts.loadLocalStates(this.workoutList);
  }

  doRefresh(event: any) {
    this.refresher = event.target;
    this.workoutService.fetchWorkouts();
  }

  identifyWorkout(index: number, item: Workout) {
    return item.id ?? index;
  }

  identifyCategory(index: number, category: WorkoutCategory) {
    return index + category.category + category.workouts.length;
  }
}
