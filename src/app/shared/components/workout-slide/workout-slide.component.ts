import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicSlides } from '@ionic/angular';

// Model
import { Workout } from '@models/workout.model';

@Component({
  selector: 'app-workout-slide',
  templateUrl: './workout-slide.component.html',
  styleUrls: ['./workout-slide.component.scss'],
})
export class WorkoutSlideComponent {
  swiperModules = [IonicSlides];

  @Input() workouts: Workout[] = [];

  @Output() onClick = new EventEmitter<Workout>();

  onWorkoutClick(workout: Workout) {
    this.onClick.emit(workout);
  }
}
