import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exercise-list-skeleton',
  templateUrl: './exercise-list-skeleton.component.html',
  styleUrls: ['./exercise-list-skeleton.component.scss'],
})
export class ExerciseListSkeletonComponent implements OnInit {
  exercises = [1, 2, 3, 4];

  constructor() {}

  ngOnInit() {}
}
