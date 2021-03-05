import { Component, Input, OnInit } from '@angular/core';

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

  constructor(private workoutService: WorkoutService) { }

  ngOnInit() {
    this.workoutService.workoutDetail.subscribe((workout) => {
      this.workout = workout;
    })
  }
}
