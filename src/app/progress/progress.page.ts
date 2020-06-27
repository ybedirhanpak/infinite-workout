import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProgressService } from './progress.service';
import { Progress } from './progress.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
})
export class ProgressPage implements OnInit, OnDestroy {
  progressList: Progress[] = [];
  listSub: Subscription;
  isLoading = false;
  constructor(private progressService: ProgressService) {}

  ngOnInit() {
    this.isLoading = true;
    this.listSub = this.progressService.progresses.subscribe((progressList) => {
      this.progressList = progressList;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.listSub.unsubscribe();
  }
}
