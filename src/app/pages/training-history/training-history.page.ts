import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';

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
    private loadingController: LoadingController
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
    this.loadingController
      .create({
        message: 'Deleting...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.trainingService
          .deleteTrainingRecord(trainingRecord.id)
          .then(() => {
            loadingEl.dismiss();
          })
          .catch(() => {
            // TODO: Display error message
          });
      });
  }
}
