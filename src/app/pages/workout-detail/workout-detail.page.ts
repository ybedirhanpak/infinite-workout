import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

// Model
import { Workout } from '@models/workout.model';

// Service
import { WorkoutService } from '@services/workout.service';

@Component({
  selector: 'app-workout-detail',
  templateUrl: './workout-detail.page.html',
  styleUrls: ['./workout-detail.page.scss'],
})
export class WorkoutDetailPage implements OnInit {
  @Input() workout: Workout | null = null;

  duration = '';
  explore = false;
  favorited = false;
  created = false;

  // Customization Logic
  customized = false;

  constructor(
    private router: Router,
    private workoutService: WorkoutService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.explore = this.router.url.includes('explore');
  }

  ionViewWillEnter() {
    this.workoutService.workoutDetail.get().subscribe(async (workout) => {
      if (!workout) {
        this.router.navigate(['/home/']);
        return;
      }

      this.favorited = !!workout.state?.favorited;
      this.created = !!workout.state?.created;
      this.customized = !!workout.state?.customized;
      this.workout = workout;
    });
  }

  startWorkout() {
    this.router.navigateByUrl('/training');
    this.workoutService.workoutDetail.set(this.workout);
  }

  async onFavoriteClick() {
    if (!this.favorited) {
      this.workoutService.saveFavorite(this.workout!).then(() => {
        this.favorited = true;
      });
    } else {
      this.workoutService.removeFavorite(this.workout!).then(() => {
        this.favorited = false;
      });
    }
  }

  async onEditClick() {
    this.workoutService.workoutEdit.set(this.workout);
    const navigateUrl = `${this.router.url}/edit-workout`;
    this.router.navigateByUrl(navigateUrl);
  }

  async onShareClick() {
    const share = () => {
      this.workoutService.uploadWorkout(this.workout!).then(() => {
        this.toastController
          .create({
            message: 'Workout is uploaded.',
            duration: 500,
            position: 'top',
          })
          .then((toast) => {
            toast.present();
          });
      });
    };

    // Ask for permission before delete
    this.alertController
      .create({
        header: 'Upload this workout?',
        message: 'This workout will be available on explore page.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Upload',
            handler: share,
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  getCustomizeTextUI() {
    return this.customized || this.created ? 'Edit' : 'Create a Copy';
  }
}
