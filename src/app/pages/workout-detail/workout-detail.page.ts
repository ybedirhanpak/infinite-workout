import { Component, Input, OnInit } from '@angular/core';
import { Workout } from '@models/workout.model';

@Component({
  selector: 'app-workout-detail',
  templateUrl: './workout-detail.page.html',
  styleUrls: ['./workout-detail.page.scss'],
})
export class WorkoutDetailPage implements OnInit {

  @Input() workout: Workout;

  constructor() { }

  ngOnInit() {
  }

}
