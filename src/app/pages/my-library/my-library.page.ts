import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { TrainingRecord } from '@models/training.model';
import { Workout } from '@models/workout.model';
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
  lastTraining: TrainingRecord;
  lastWorkout: Workout;

  constructor(
    private workoutService: WorkoutService,
    private trainingService: TrainingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.workoutService.favorites.subscribe((favorites) => {
      this.favorites = plainToClass(Workout, favorites);;
    });

    this.trainingService.trainingRecordList.subscribe((trainingRecordList) => {
      if(trainingRecordList.length > 0) {
        this.lastTraining = trainingRecordList[0];
        this.lastWorkout = plainToClass(Workout, this.lastTraining.workout);
      }
    });
  }

  ionViewWillEnter() {
    this.workoutService.fetchFavorites();
    this.trainingService.fetchTrainingRecordList();
  }

  onWorkoutClick(workout: Workout) {
    this.workoutService.setWorkoutDetail(workout);
    this.router.navigateByUrl('/home/my-library/workout-detail');
  }
}
