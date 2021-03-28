import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

// Model
import { Workout } from '@models/workout.model';

@Component({
  selector: 'app-highlight-workout-slide',
  templateUrl: './highlight-workout-slide.component.html',
  styleUrls: ['./highlight-workout-slide.component.scss'],
})
export class HighlightWorkoutSlideComponent implements OnInit {
  @Input() workouts: Workout[] = [];
  @Input() filter: string = 'dark';

  @Output() onClick = new EventEmitter<Workout>();

  slideOptions = {
    initialSlide: 0,
    speed: 500,
    slidesPerView: 1.05,
    centerSlide: true,
    spaceBetween: 12,
  };

  ngOnInit() {}

  onWorkoutClick(workout: Workout) {
    this.onClick.emit(workout);
  }
}
