import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProgressService } from './services/progress.service';
import { Progress } from './models/progress.model';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
})
export class ProgressPage implements OnInit, OnDestroy {
  /** Subscription */
  private subscriptions = new Subscription();

  /** Progress list */
  progressList: Progress[] = [];
  isLoading = false;
  reorder = false;

  constructor(
    private progressService: ProgressService,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.progressService.progressList.subscribe((progressList) => {
        this.progressList = progressList;
      })
    );
  }

  ionViewWillEnter() {
    this.isLoading = true;
    // Fetch progress list when user enters this page.
    this.progressService
      .fetchProgressList()
      .then(() => {
        this.isLoading = false;
      })
      .catch(() => {
        // TODO: Display error message
      });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * @returns if the progress list empty or not.
   */
  isProgressListNotEmpty() {
    return !this.isLoading && this.progressList && this.progressList.length > 0;
  }

  /**
   * Deletes given progress
   * @param progress progress to be deleted
   */
  deleteProgress(progress: Progress) {
    this.loadingController
      .create({
        message: 'Deleting...',
      })
      .then((loading) => {
        loading.present();
        this.progressService
          .deleteProgress(progress.id)
          .catch(() => {
            // TODO: Display error message
          })
          .finally(() => {
            loading.dismiss();
          });
      });
  }

  /**
   * Navigates to progress edit page
   * @param progress progress to be edited
   */
  editProgress(progress: Progress) {
    this.router.navigate(['/', 'home', 'progress', 'edit', progress.id]);
  }

  /**
   * Opens and closes reorder option for progress list
   */
  toggleReorder() {
    if (!this.progressList || this.progressList.length <= 0) {
      return;
    }
    if (this.reorder) {
      this.progressService.reorderProgresses(this.progressList).catch(() => {
        // TODO: Display error message
      });
    }
    this.reorder = !this.reorder;
  }

  /**
   * Executed when list is reordered
   * @param event change in ordering of progress list
   */
  reorderProgressList(event: any) {
    const itemMove = this.progressList.splice(event.detail.from, 1)[0];
    this.progressList.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
  }
}
