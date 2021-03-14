import { Component, OnInit } from '@angular/core';

// Model
import { Workout } from '@models/workout.model';
import { WorkoutService } from '@services/workout.service';

// Data
import WORKOUT from '../../data/workout.json';

@Component({
  selector: 'app-my-library',
  templateUrl: './my-library.page.html',
  styleUrls: ['./my-library.page.scss'],
})
export class MyLibraryPage implements OnInit {
  myWorkouts = WORKOUT as Workout[];

  favorites: Workout[] = [];

  constructor(private workoutService: WorkoutService) {}

  ngOnInit() {
    this.workoutService.favorites.subscribe((favorites) => {
      this.favorites = favorites;
    })
  }

  ionViewWillEnter() {
    this.workoutService.fetchFavorites();
  }
}
