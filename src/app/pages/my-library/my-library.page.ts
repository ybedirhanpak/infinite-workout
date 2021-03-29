import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { TrainingRecord } from '@models/training.model';
import { Workout } from '@models/workout.model';

// Service
import { TrainingService } from '@services/training.service';
import { WorkoutService } from '@services/workout.service';

@Component({
  selector: 'app-my-library',
  templateUrl: './my-library.page.html',
  styleUrls: ['./my-library.page.scss'],
})
export class MyLibraryPage implements OnInit {
  favoriteWorkouts: Workout[] = [];
  createdWorkouts: Workout[] = [];
  customizedWorkouts: Workout[] = [];

  lastTraining: TrainingRecord;
  lastWorkout: Workout;

  constructor(
    private workoutService: WorkoutService,
    private trainingService: TrainingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.workoutService.favorites$.subscribe((favorites) => {
      this.favoriteWorkouts = favorites;
    });

    this.workoutService.createdWorkouts$.subscribe((workouts) => {
      this.createdWorkouts = workouts;
    });

    this.workoutService.customizedWorkouts$.subscribe((workouts) => {
      this.customizedWorkouts = workouts;
    });

    this.trainingService.trainingRecordList.subscribe((trainingRecordList) => {
      if(trainingRecordList.length > 0) {
        this.lastTraining = trainingRecordList[0];
        this.lastWorkout = this.lastTraining.workout;
      }
    });
  }

  ionViewWillEnter() {
    this.workoutService.workouts.fetchFromStorage();
    this.trainingService.fetchTrainingRecordList();
  }

  onWorkoutClick(workout: Workout) {
    this.workoutService.workoutDetail.set(workout);
    this.router.navigateByUrl('/workout-detail');
  }

  onMyWorkoutClick(workout: Workout) {
    this.workoutService.workoutDetail.set(workout);
    this.router.navigateByUrl('/workout-detail');
  }
}
