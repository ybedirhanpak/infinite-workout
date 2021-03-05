import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Model
import { Progress } from '@models/progress.model';

// Service
import { ExploreService } from '@services/explore.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit, OnDestroy {
  /** Subscription */
  private subscriptions = new Subscription();

  /** Progress list */
  progressList: Progress[];
  isLoading = false;

  constructor(
    private exploreService: ExploreService,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.exploreService.progressList.subscribe((progressList) => {
        this.progressList = progressList;
      })
    );
  }

  ionViewWillEnter() {
    this.isLoading = true;
    // Fetch progress list when user enters this page
    this.exploreService
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
   * Navigates to progress detail page
   * @param progress progress which its detail page will be opened
   */
  openProgressDetail(progress: Progress) {
    this.router.navigate(['/', 'home', 'explore', 'progress', progress.id]);
  }

  /**
   * Downloads progress to local
   * @param progress progress to be downloaded
   */
  downloadProgress(progress: Progress) {
    if (!progress) {
      return;
    }
    this.loadingController
      .create({
        message: 'Downloading...',
      })
      .then((loading) => {
        loading.present();
        this.exploreService
          .downloadProgress(progress.id)
          .then(() => {
            this.router.navigate(['/', 'home', 'progress']);
          })
          .catch(() => {
            // TODO: Displat error message
          })
          .finally(() => {
            loading.dismiss();
          });
      });
  }
}
