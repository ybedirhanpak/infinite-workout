import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { Progress } from 'src/app/progress/models/progress.model';
import { ExploreService } from '../services/explore.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-progress-detail',
  templateUrl: './progress-detail.page.html',
  styleUrls: ['./progress-detail.page.scss'],
})
export class ProgressDetailPage implements OnInit {
  progress: Progress;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private exploreService: ExploreService,
    private navController: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('progressId')) {
        this.navController.navigateBack('/home/progress');
        return;
      }
      this.isLoading = true;
      this.exploreService
        .getProgress(parseInt(paramMap.get('progressId'), 10))
        .then((progress) => {
          this.progress = progress;
          this.isLoading = false;
        });
    });
  }

  /**
   * Downloads progress to local progress list
   */
  downloadProgress() {
    if (!this.progress) {
      return;
    }
    this.loadingController
      .create({
        message: 'Downloading...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.exploreService
          .downloadProgress(this.progress.id)
          .then(() => {
            this.router.navigate(['/', 'home', 'progress']);
          })
          .catch(() => {
            // TODO: Display error message
          })
          .finally(() => {
            loadingEl.dismiss();
          });
      });
  }
}
