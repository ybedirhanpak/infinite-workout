import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicSlides } from '@ionic/angular';

// Model
import { Workout } from '@models/workout.model';

@Component({
  selector: 'app-workout-slide',
  templateUrl: './workout-slide.component.html',
  styleUrls: ['./workout-slide.component.scss'],
})
export class WorkoutSlideComponent {
  swiperModules = [IonicSlides];

  @Input() workouts: Workout[] = [];
  @Input() cardPerView = 2.2;
  @Input() spaceBetween = 12;

  @Output() onClick = new EventEmitter<Workout>();

  cardWidth: string = "100%";
  cardPadding: string = "0px";

  onWorkoutClick(workout: Workout) {
    this.onClick.emit(workout);
  }

  ngOnInit() {
    this.cardWidth = `${(window.innerWidth / (this.cardPerView) - this.spaceBetween)}px`;
    this.cardPadding = `${this.spaceBetween}px`;
  }
}
