import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { TrainingRecord } from '@models/training.model';
import { Workout } from '@models/workout.model';

// Service
import { TrainingService } from '@services/training.service';
import { WorkoutService } from '@services/workout.service';
import { plainToClass } from 'class-transformer';

@Component({
  selector: 'app-my-library',
  templateUrl: './my-library.page.html',
  styleUrls: ['./my-library.page.scss'],
})
export class MyLibraryPage implements OnInit {
  favorites: Workout[] = [];
  myWorkouts: Workout[] = [];
  lastTraining: TrainingRecord;
  lastWorkout: Workout;

  constructor(
    private workoutService: WorkoutService,
    private trainingService: TrainingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.workoutService.favoriteWorkouts.elements.subscribe((favorites) => {
      this.favorites = plainToClass(Workout, favorites);
    });

    this.workoutService.createdWorkouts.elements.subscribe((workouts) => {
      this.myWorkouts = plainToClass(Workout, workouts);
    });

    this.trainingService.trainingRecordList.subscribe((trainingRecordList) => {
      if(trainingRecordList.length > 0) {
        this.lastTraining = trainingRecordList[0];
        this.lastWorkout = plainToClass(Workout, this.lastTraining.workout);
      }
    });
  }

  ionViewWillEnter() {
    this.workoutService.favoriteWorkouts.fetchFromStorage();
    this.workoutService.createdWorkouts.fetchFromStorage();
    this.trainingService.fetchTrainingRecordList();
  }

  onWorkoutClick(workout: Workout) {
    this.workoutService.workoutDetail.set(workout);
    this.router.navigateByUrl('/home/my-library/workout-detail');
  }

  onMyWorkoutClick(workout: Workout) {
    // this.router.navigateByUrl(`/home/my-library/edit-workout/${workout.id}`);
    this.workoutService.workoutDetail.set(workout);
    this.router.navigateByUrl('/home/my-library/workout-detail');
  }
}
