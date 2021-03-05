import { Component, OnInit } from '@angular/core';

// Model
import { Workout } from '@models/workout.model';

// Data
import WORKOUT from '../../data/workout.json';

@Component({
  selector: 'app-my-library',
  templateUrl: './my-library.page.html',
  styleUrls: ['./my-library.page.scss'],
})
export class MyLibraryPage implements OnInit {
  myWorkouts = WORKOUT as Workout[];
  favoriteWorkouts = WORKOUT as Workout[];

  constructor() {}

  ngOnInit() {}
}
