import { Component, OnInit, OnDestroy } from '@angular/core';
import { Progress } from '../progress/progress.model';
import { ExploreService } from './explore.service';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit, OnDestroy {
  progressList: Progress[];
  progressSub: Subscription;
  isLoading = false;
  constructor(
    private exploreService: ExploreService,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    this.progressSub = this.exploreService.progressList.subscribe(
      (progressList) => {
        this.progressList = progressList;
      }
    );
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.exploreService.fetchBookings().subscribe((fetchData) => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.progressSub) {
      this.progressSub.unsubscribe();
    }
  }

  openProgressDetail(progress: Progress) {
    this.router.navigate(['/', 'home', 'explore', 'progress', progress.id]);
  }

  downloadProgress(progress: Progress) {
    if (!progress) {
      return;
    }
    this.loadingController
      .create({
        message: 'Downloading...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.exploreService.downloadProgress(progress.id).subscribe((data) => {
          loadingEl.dismiss();
          this.router.navigate(['/', 'home', 'progress']);
        });
      });
  }
}
