import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingRecord } from '@models/training.model';

// Model
import { Workout, getWorkoutDuration } from '@models/workout.model';
import { TrainingService } from '@services/training.service';
import { WorkoutService } from '@services/workout.service';

@Component({
  selector: 'app-my-library',
  templateUrl: './my-library.page.html',
  styleUrls: ['./my-library.page.scss'],
})
export class MyLibraryPage implements OnInit {
  favorites: Workout[] = [];
  lastTraining: TrainingRecord;

  constructor(
    private workoutService: WorkoutService,
    private trainingService: TrainingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.workoutService.favorites.subscribe((favorites) => {
      this.favorites = favorites;
    });

    this.trainingService.trainingRecordList.subscribe((trainingRecordList) => {
      const length = trainingRecordList.length;
      this.lastTraining = length > 0 ? trainingRecordList[0] : undefined;
    });
  }

  ionViewWillEnter() {
    this.workoutService.fetchFavorites();
    this.trainingService.fetchTrainingRecordList();
  }

  getDuration = getWorkoutDuration;

  onWorkoutClick(workout: Workout) {
    this.workoutService.setWorkoutDetail(workout);
    this.router.navigateByUrl('/home/my-library/workout-detail');
  }
}
