import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';

// Model
import { TrainingRecord } from '@models/training.model';

// Service
import { TrainingService } from '@services/training.service';

@Component({
  selector: 'app-training-history',
  templateUrl: './training-history.page.html',
  styleUrls: ['./training-history.page.scss'],
})
export class TrainingHistoryPage implements OnInit, OnDestroy {
  trainingRecordList: TrainingRecord[] = [];
  trainingRecordSub: Subscription;
  isLoading = false;

  constructor(
    private trainingService: TrainingService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.trainingRecordSub = this.trainingService.trainingRecordList.subscribe(
      (trainingRecordList) => {
        this.trainingRecordList = trainingRecordList;
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
    if (this.trainingRecordSub) {
      this.trainingRecordSub.unsubscribe();
    }
  }

  deleteTrainingRecord(trainingRecord: TrainingRecord) {
    let message = '';

    this.trainingService
      .deleteTrainingRecord(trainingRecord.id)
      .then(() => {
        message = 'Training record deleted successfully.';
      })
      .catch((error) => {
        message = error ?? 'An error occured while deleting the training record.';
      })
      .finally(() => {
        this.toastController
          .create({
            message,
            position: 'top',
            duration: 1000
          })
          .then((toastEl) => {
            toastEl.present();
          });
      });
  }
}
