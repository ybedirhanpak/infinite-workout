import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProgressService } from './progress.service';
import { Progress } from './progress.model';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
})
export class ProgressPage implements OnInit, OnDestroy {
  progressList: Progress[] = [];
  listSub: Subscription;
  isLoading = false;
  constructor(
    private progressService: ProgressService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.listSub = this.progressService.progresses.subscribe((progressList) => {
      this.progressList = progressList;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.progressService.fetchProgresses().subscribe((data) => {
      console.log('Fetch Data', data);
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.listSub.unsubscribe();
  }

  deleteProgress(progress: Progress) {
    this.loadingController
      .create({
        message: 'Deleting...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.progressService.deleteProgress(progress.id).subscribe(() => {
          loadingEl.dismiss();
        });
      });
  }
}
