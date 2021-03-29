import { Component, EventEmitter, Input, Output } from '@angular/core';

// Model
import { Workout } from '@models/workout.model';

@Component({
  selector: 'app-workout-slide',
  templateUrl: './workout-slide.component.html',
  styleUrls: ['./workout-slide.component.scss'],
})
export class WorkoutSlideComponent {
  @Input() workouts: Workout[] = [];
  @Input() filter: string = 'none';

  @Output() onClick = new EventEmitter<Workout>();

  slideOptions = {
    initialSlide: 0,
    speed: 500,
    slidesPerView: 2.1,
    spaceBetween: 12,
  };

  onWorkoutClick(workout: Workout) {
    this.onClick.emit(workout);
  }
}
