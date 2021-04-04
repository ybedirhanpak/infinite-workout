import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Workout } from '@models/workout.model';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.scss'],
})
export class WorkoutListComponent {
  @Input() workouts: Workout[] = [];

  @Output() onClick = new EventEmitter<Workout>();

  onWorkoutClick(workout: Workout) {
    this.onClick.emit(workout);
  }
}
