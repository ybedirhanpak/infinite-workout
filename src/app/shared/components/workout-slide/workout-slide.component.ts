import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
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
export class WorkoutSlideComponent implements OnChanges {
  @Input() workouts: Workout[] = [];
  @Input() filter: string = 'none';

  @Output() onClick = new EventEmitter<Workout>();

  slideOptions = {
    initialSlide: 0,
    speed: 500,
    slidesPerView: 2,
    spaceBetween: 12,
  };

  ngOnChanges(changes: SimpleChanges) {
    const workouts = changes['workouts'];
    if (workouts) {
      this.updateSlideOptions(workouts.currentValue);
    }
  }

  updateSlideOptions(workouts: Workout[]) {
    if (workouts.length > 2) {
      this.slideOptions.slidesPerView = 2.1;
    } else {
      this.slideOptions.slidesPerView = 2;
    }
  }

  onWorkoutClick(workout: Workout) {
    this.onClick.emit(workout);
  }
}
