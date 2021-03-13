import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

// Model
import { TrainingRecord } from '@models/training.model';

// Service
import { TrainingService } from '@services/training.service';

@Component({
  selector: 'app-training-record',
  templateUrl: './training-record.page.html',
  styleUrls: ['./training-record.page.scss'],
})
export class TrainingRecordPage implements OnInit, OnDestroy {
  paramSub: Subscription;
  trainingRecord: TrainingRecord;
  isLoading = false;

  constructor(
    private alertController: AlertController,
    private navController: NavController,
    private route: ActivatedRoute,
    private trainingService: TrainingService
  ) {}

  ngOnInit() {
    this.paramSub = this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('id')) {
        // this.navController.navigateBack('/home');
        return;
      }
      this.isLoading = true;
      this.trainingService
        .getTrainingRecord(parseInt(paramMap.get('id'), 10))
        .then((trainingRecord) => {
          this.trainingRecord = trainingRecord;
          if (!this.trainingRecord) {
            this.showErrorModal();
            return;
          }
        })
        .catch(() => {
          this.showErrorModal();
        })
        .finally(() => {
          this.isLoading = false;
        });
    });
  }

  ngOnDestroy() {
    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }
  }

  showErrorModal() {
    this.alertController
      .create({
        header: 'Error occured.',
        message: 'Please try again.',
        buttons: [
          {
            text: 'Okay',
            handler: () => this.navController.navigateBack('/home'),
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }
}
