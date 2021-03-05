import { Component, Input, OnInit } from '@angular/core';

interface WorkoutCard {
  name: string;
  category: string;
  imageUrl: string;
}

@Component({
  selector: 'app-workout-slide',
  templateUrl: './workout-slide.component.html',
  styleUrls: ['./workout-slide.component.scss'],
})
export class WorkoutSlideComponent implements OnInit {
  @Input() workoutCards: WorkoutCard[] = [];

  slideOptions = {
    initialSlide: 0,
    speed: 500,
    slidesPerView: 2.2,
  };

  constructor() {}

  ngOnInit() {}
}
