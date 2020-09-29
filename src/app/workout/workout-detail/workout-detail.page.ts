import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Workout } from '../models/workout.model';
import { ActivatedRoute } from '@angular/router';
import { WorkoutService } from '../services/workout.service';

@Component({
  selector: 'app-workout-detail',
  templateUrl: './workout-detail.page.html',
  styleUrls: ['./workout-detail.page.scss'],
})
export class WorkoutDetailPage implements OnInit, OnDestroy {
  paramSub: Subscription;
  workout: Workout;
  isLoading = false;
  constructor(
    private alertController: AlertController,
    private navController: NavController,
    private route: ActivatedRoute,
    private workoutService: WorkoutService
  ) {}

  ngOnInit() {
    this.paramSub = this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('workoutId')) {
        this.navController.navigateBack('/home/workout');
        return;
      }
      this.isLoading = true;
      this.workoutService
        .getWorkout(parseInt(paramMap.get('workoutId'), 10))
        .then((workout) => {
          this.workout = workout;
          if (!this.workout) {
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
            handler: () => this.navController.navigateBack('/home/workout'),
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }
}
