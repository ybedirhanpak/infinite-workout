import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';

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
  trainingRecordList: TrainingRecord[];
  trainingRecordSub: Subscription;
  isLoading = false;

  constructor(
    private trainingService: TrainingService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.trainingRecordSub = this.trainingService.trainingRecordList.subscribe(
      (trainingRecordList) => {
        console.log('List', trainingRecordList);
        this.trainingRecordList = trainingRecordList;
      }
    );
  }

  ionViewWillEnter() {
    // Fetch training records from data source
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

  deleteTrainingRecord(id: number) {
    const deleteRecord = () => {
      let message = '';

      this.trainingService
        .deleteTrainingRecord(id)
        .then(() => {
          message = 'Training record deleted successfully.';
        })
        .catch((error) => {
          message =
            error ?? 'An error occured while deleting the training record.';
        })
        .finally(() => {
          this.toastController
            .create({
              message,
              position: 'top',
              duration: 500,
            })
            .then((toastEl) => {
              toastEl.present();
            });
        });
    };

    // Ask for permission before delete
    this.alertController
      .create({
        header: 'Delete this record?',
        message:
          'All training information and exercise statistics will be deleted.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            handler: deleteRecord,
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  recordIdentifier(index: number, item: TrainingRecord) {
    return item ? item.id : index;
  }
}
