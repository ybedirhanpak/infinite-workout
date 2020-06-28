import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProgressService } from './progress.service';
import { Progress } from './progress.model';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
})
export class ProgressPage implements OnInit, OnDestroy {
  progressList: Progress[] = [];
  listSub: Subscription;
  isLoading = false;
  reorder = false;
  constructor(
    private progressService: ProgressService,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    this.listSub = this.progressService.progresses.subscribe((progressList) => {
      this.progressList = progressList;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.progressService.fetchProgresses().subscribe((data) => {
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

  editProgress(progress: Progress) {
    this.router.navigate(['/', 'home', 'progress', 'edit', progress.id]);
  }

  toggleReorder() {
    if (this.reorder) {
      this.progressService
        .reorderProgresses(this.progressList)
        .subscribe(() => {});
    }
    this.reorder = !this.reorder;
  }

  reorderProgressList(event: any) {
    const itemMove = this.progressList.splice(event.detail.from, 1)[0];
    this.progressList.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
  }
}
