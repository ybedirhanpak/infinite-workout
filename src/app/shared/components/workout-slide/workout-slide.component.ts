import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { Workout } from '@models/workout.model';

// Service
import { WorkoutService } from '@services/workout.service';

@Component({
  selector: 'app-workout-slide',
  templateUrl: './workout-slide.component.html',
  styleUrls: ['./workout-slide.component.scss'],
})
export class WorkoutSlideComponent implements OnInit {
  @Input() workouts: Workout[] = [];
  @Input() filter: string = 'red-turquoise';

  @Output() onClick = new EventEmitter<Workout>();

  slideOptions = {
    initialSlide: 0,
    speed: 500,
    slidesPerView: 2.2,
    spaceBetween: 8,
  };

  constructor(private workoutService: WorkoutService, private router: Router) {}

  ngOnInit() {
    if (this.workouts.length > 1) {
      this.slideOptions.slidesPerView = 2.2;
    } else {
      this.slideOptions.slidesPerView = 1.2;
    }
  }

  onWorkoutClick(workout: Workout) {
    this.onClick.emit(workout);
  }
}
