import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Exercise } from '@models/exercise.model';
import { ExerciseService } from '@services/exercise.service';

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.page.html',
  styleUrls: ['./exercise-detail.page.scss'],
})
export class ExerciseDetailPage {

  exercise: Exercise;
  selectable = false;

  constructor(private exerciseService: ExerciseService, private router: Router) { }

  ionViewWillEnter() {
    this.exerciseService.exerciseDetail.subscribe(async (exercise) => {
      this.exercise = exercise;      
    });

    if(this.router.url.includes("create-workout") || this.router.url.includes("edit-workout")) {
      this.selectable = true;
    }
  }

  onSelectClick() {
    this.exerciseService.setExerciseDetail(this.exercise);
    const navigateUrl = `${this.router.url}/exercise-edit`;
    this.router.navigateByUrl(navigateUrl);
  }
}
