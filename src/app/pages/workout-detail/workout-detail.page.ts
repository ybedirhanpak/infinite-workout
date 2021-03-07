import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { getLoadString, getRepString, Workout } from '@models/workout.model';

// Service
import { WorkoutService } from '@services/workout.service';


@Component({
  selector: 'app-workout-detail',
  templateUrl: './workout-detail.page.html',
  styleUrls: ['./workout-detail.page.scss'],
})
export class WorkoutDetailPage implements OnInit {
  @Input() workout: Workout;

  duration = '';
  exercises = [];

  constructor(
    private workoutService: WorkoutService,
    private router: Router
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.workoutService.workoutDetail.subscribe((workout) => {
      this.workout = workout;
      const { time, unit } = this.workout.duration.opts;
      this.duration = `${time} ${unit}`;

      this.exercises = this.workout.exercises.map((exercise) => {
        let load = getLoadString(exercise);
        let rep = getRepString(exercise);

        return {
          name: exercise.name,
          imageUrl: exercise.imageUrl,
          rep,
          load,
        };
      });
    });
  }

  startWorkout() {
    this.router.navigateByUrl('/training');
    this.workoutService.setWorkoutDetail(this.workout);
  }
}
