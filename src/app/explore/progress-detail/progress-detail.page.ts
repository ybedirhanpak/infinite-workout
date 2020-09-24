import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { Progress } from 'src/app/progress/models/progress.model';
import { ExploreService } from '../explore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-progress-detail',
  templateUrl: './progress-detail.page.html',
  styleUrls: ['./progress-detail.page.scss'],
})
export class ProgressDetailPage implements OnInit, OnDestroy {
  paramSub: Subscription;
  progress: Progress;
  progressSub: Subscription;
  isLoading = false;
  constructor(
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private exploreService: ExploreService,
    private navController: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    this.paramSub = this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('progressId')) {
        this.navController.navigateBack('/home/progress');
        return;
      }

      this.isLoading = true;
      this.progressSub = this.exploreService
        .getProgress(parseInt(paramMap.get('progressId')))
        .subscribe((progress) => {
          this.progress = progress;
          this.isLoading = false;
        });
    });
  }

  ngOnDestroy() {
    if (this.progressSub) {
      this.progressSub.unsubscribe();
    }
  }

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
          .subscribe((data) => {
            console.log('Download data', data);
            loadingEl.dismiss();
            this.router.navigate(['/', 'home', 'progress']);
          });
      });
  }
}
