import { Component, OnInit, OnDestroy } from '@angular/core';
import { Workout } from '../workout.model';
import { Subscription } from 'rxjs';
import { WorkoutService } from '../workout.service';
import { LoadingController } from '@ionic/angular';

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
    private loadingController: LoadingController
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
    this.workoutService.fetchWorkoutList().subscribe((data) => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.workoutSub.unsubscribe();
  }

  deleteWorkout(workout: Workout) {
    this.loadingController
      .create({
        message: 'Deleting...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.workoutService.deleteWorkout(workout.id).subscribe(() => {
          loadingEl.dismiss();
        });
      });
  }
}
