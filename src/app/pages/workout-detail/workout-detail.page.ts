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
      this.favorited = await this.workoutService.favoriteWorkouts.contains(
        workout
      );

      this.created = await this.workoutService.createdWorkouts.contains(
        workout
      );

      const customized = (await this.workoutService.customizedWorkouts.find(
        workout
      )) as Workout;

      if (customized) {
        this.original = workout;
        this.workout = customized;
        this.customized = true;
      } else {
        this.workout = workout;
      }
    });
  }

  startWorkout() {
    this.router.navigateByUrl('/training');
    this.workoutService.workoutDetail.set(this.workout);
  }

  async onFavoriteClick() {
    if (!this.favorited) {
      await this.workoutService.favoriteWorkouts.create(this.workout);
    } else {
      await this.workoutService.favoriteWorkouts.remove(this.workout);
    }
    this.favorited = await this.workoutService.favoriteWorkouts.contains(
      this.workout
    );
  }

  async onEditClick() {
    this.workoutService.workoutEdit.set(this.workout);
    const navigateUrl = `${this.router.url}/edit-workout`;
    this.router.navigateByUrl(navigateUrl);
  }
}
