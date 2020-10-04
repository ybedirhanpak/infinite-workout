import { Component, OnInit, OnDestroy } from '@angular/core';
import { Workout } from '../../workout/models/workout.model';
import { Subscription } from 'rxjs';
import { WorkoutService } from '../../workout/services/workout.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workout-history',
  templateUrl: './workout-history.page.html',
  styleUrls: ['./workout-history.page.scss'],
})
export class WorkoutHistoryPage implements OnInit, OnDestroy {
  workoutList: Workout[] = [];
  workoutSub: Subscription;
  isLoading = false;

  constructor(
    private workoutService: WorkoutService,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    this.workoutSub = this.workoutService.workoutList.subscribe(
      (workoutList) => {
        this.workoutList = workoutList;
      }
    );
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.workoutService.fetchWorkoutList().then(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.workoutSub) {
      this.workoutSub.unsubscribe();
    }
  }

  /**
   * Deletes given workout from workout history
   * @param workout workout to be deleted
   */
  deleteWorkout(workout: Workout) {
    this.loadingController
      .create({
        message: 'Deleting...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.workoutService.deleteWorkout(workout.id)
        .then(() => {
          loadingEl.dismiss();
        })
        .catch(() => {
          // TODO: Display error message
        });
      });
  }
}
