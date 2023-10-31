import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicSlides } from '@ionic/angular';

// Model
import { Workout } from '@models/workout.model';

@Component({
  selector: 'app-highlight-workout-slide',
  templateUrl: './highlight-workout-slide.component.html',
  styleUrls: ['./highlight-workout-slide.component.scss'],
})
export class HighlightWorkoutSlideComponent implements OnInit {
  swiperModules = [IonicSlides];

  @Input() workouts: Workout[] = [];
  @Input() filter: string = 'dark';

  @Output() onClick = new EventEmitter<Workout>();

  ngOnInit() {}

  onWorkoutClick(workout: Workout) {
    this.onClick.emit(workout);
  }

  identifyWorkout(index: number, item: Workout){
    return item.id ?? index; 
 }
}
