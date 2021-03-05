import { Component, OnInit } from '@angular/core';
import WORKOUT from '../../data/workout.json';

@Component({
  selector: 'app-my-library',
  templateUrl: './my-library.page.html',
  styleUrls: ['./my-library.page.scss'],
})
export class MyLibraryPage implements OnInit {
  myWorkouts = WORKOUT;
  favoriteWorkouts = WORKOUT;

  constructor() {}

  ngOnInit() {}
}
