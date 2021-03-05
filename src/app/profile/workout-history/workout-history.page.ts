import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingRecord } from '../../training/models/training.model';
import { Subscription } from 'rxjs';
import { TrainingService } from '../../training/services/training.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-workout-history',
  templateUrl: './workout-history.page.html',
  styleUrls: ['./workout-history.page.scss'],
})
export class WorkoutHistoryPage implements OnInit, OnDestroy {
  workoutList: TrainingRecord[] = [];
  workoutSub: Subscription;
  isLoading = false;

  constructor(
    private trainingService: TrainingService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.workoutSub = this.trainingService.trainingRecordList.subscribe(
      (workoutList) => {
        this.workoutList = workoutList;
      }
    );
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.trainingService.fetchTrainingRecordList().then(() => {
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
  deleteWorkout(workout: TrainingRecord) {
    this.loadingController
      .create({
        message: 'Deleting...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.trainingService.deleteTrainingRecord(workout.id)
        .then(() => {
          loadingEl.dismiss();
        })
        .catch(() => {
          // TODO: Display error message
        });
      });
  }
}
