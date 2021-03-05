import { Component, Input, OnInit } from '@angular/core';
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

  slideOptions = {
    initialSlide: 0,
    speed: 500,
    slidesPerView: 2.2,
  };

  constructor(private workoutService: WorkoutService, private router: Router) {}

  ngOnInit() {}

  onWorkoutClick(workout: Workout) {
    this.workoutService.setWorkoutDetail(workout);
    this.router.navigateByUrl("/home/workout-detail")
  }
}
