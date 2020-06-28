import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Progress } from '../progress/progress.model';
import { ProgressService } from '../progress/progress.service';
import { Subscription } from 'rxjs';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
})
export class WorkoutPage implements OnInit, OnDestroy {
  /** Top Slides */
  @ViewChild('progressSlider') progressSlider: IonSlides;
  private listSub: Subscription;
  progressList: Progress[];
  isLoading = false;
  /** Circle Progress*/
  restTime = 120; // seconds
  constructor(private progressService: ProgressService) {}

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

  slideAction(action: 'forward' | 'back') {
    if (!this.progressSlider) {
      return;
    }
    if (action === 'forward') {
      this.progressSlider.slideNext();
    } else if (action === 'back') {
      this.progressSlider.slidePrev();
    }
  }
}
