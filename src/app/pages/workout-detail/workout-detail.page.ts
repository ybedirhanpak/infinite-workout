import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

// Model
import { Workout } from '@models/workout.model';

// Service
import { WorkoutService } from '@services/workout.service';
import { plainToClass } from 'class-transformer';

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

  constructor(
    private workoutService: WorkoutService,
    private router: Router,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.explore = this.router.url.includes('explore');
  }

  ionViewWillEnter() {
    this.workoutService.workoutDetail.get().subscribe(async (workout) => {
      this.workout = plainToClass(Workout, workout);
      this.favorited = await this.workoutService.favoriteWorkouts.contains(
        this.workout
      );
      this.created = await this.workoutService.createdWorkouts.contains(
        this.workout
      );
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
    this.router.navigateByUrl(
      `/home/my-library/edit-workout/${this.workout.id}`
    );
  }
}
