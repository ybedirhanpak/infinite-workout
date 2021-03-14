import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { Workout } from '@models/workout.model';
import { WorkoutService } from '@services/workout.service';

@Component({
  selector: 'app-highlight-workout-slide',
  templateUrl: './highlight-workout-slide.component.html',
  styleUrls: ['./highlight-workout-slide.component.scss'],
})
export class HighlightWorkoutSlideComponent implements OnInit {
  @Input() workouts: Workout[] = [];
  @Input() filter: string = 'yellow-blue';

  @Output() onClick = new EventEmitter<Workout>();

  slideOptions = {
    initialSlide: 0,
    speed: 500,
    slidesPerView: 1.1,
    centerSlide: true,
  };

  constructor(
    private workoutService: WorkoutService,
    private router: Router
  ) {}

  ngOnInit() {}

  getWorkoutDuration(workout: Workout) {
    return `${workout.duration.opts.time} ${workout.duration.opts.unit}`;
  }
  
  onWorkoutClick(workout: Workout) {
    this.onClick.emit(workout);
  }
}