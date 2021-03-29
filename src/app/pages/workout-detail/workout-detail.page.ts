import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  @Input() workout: Workout;

  duration = '';
  explore = false;
  favorited = false;
  created = false;

  // Customization Logic
  customized = false;
  original: Workout;

  constructor(private router: Router, private workoutService: WorkoutService) {}

  ngOnInit() {
    this.explore = this.router.url.includes('explore');
  }

  ionViewWillEnter() {
    this.workoutService.workoutDetail.get().subscribe(async (workout) => {
      this.favorited = workout.state?.favorited;
      this.created = workout.state?.created;
      this.customized = workout.state?.customized;
      this.workout = workout;
    });
  }

  startWorkout() {
    this.router.navigateByUrl('/training');
    this.workoutService.workoutDetail.set(this.workout);
  }

  async onFavoriteClick() {
    if (!this.favorited) {
      this.workoutService.saveFavorite(this.workout).then(() => {
        this.favorited = true;
      });
    } else {
      this.workoutService.removeFavorite(this.workout).then(() => {
        this.favorited = false;
      });
    }
  }

  async onEditClick() {
    this.workoutService.workoutEdit.set(this.workout);
    const navigateUrl = `${this.router.url}/edit-workout`;
    this.router.navigateByUrl(navigateUrl);
  }

  getCustomizeTextUI() {
    return this.customized || this.created ? 'Edit' : 'Customize';
  }
}
