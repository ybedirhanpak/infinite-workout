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

  duration = '';
  exercises = [];

  constructor(private workoutService: WorkoutService) {}

  ngOnInit() {
    this.workoutService.workoutDetail.subscribe((workout) => {
      this.workout = workout;
      const { time, unit } = this.workout.duration.opts;
      this.duration = `${time} ${unit}`;

      this.exercises = this.workout.exercises.map((exercise) => {
        let load = '';
        let rep = '';

        switch (exercise.load.type) {
          case 'weight':
            load = `${exercise.load.opts.weight} ${exercise.load.opts.unit}`;
            break;
          case 'distance':
            load = `${exercise.load.opts.distance} ${exercise.load.opts.unit}`;
            break;
          case 'bodyWeight':
            load = 'Body weight';
            break;
          default:
            break;
        }

        switch (exercise.rep.type) {
          case 'setRep':
            rep = `${exercise.rep.opts.set} sets ${exercise.rep.opts.rep} reps`;
            break;
          case 'time':
            rep = `${exercise.rep.opts.time} ${exercise.rep.opts.unit}`;
            break;
          case 'setTime':
            rep = `${exercise.rep.opts.set} sets ${exercise.rep.opts.time} ${exercise.rep.opts.unit}`;
            break;
          default:
            break;
        }

        return {
          name: exercise.name,
          imageUrl: exercise.imageUrl,
          rep,
          load,
        };
      });
    });
  }
}
