import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicSlides } from '@ionic/angular';

// Model
import { Exercise } from '@models/exercise.model';

@Component({
  selector: 'app-exercise-slide',
  templateUrl: './exercise-slide.component.html',
  styleUrls: ['./exercise-slide.component.scss'],
})
export class ExerciseSlideComponent {
  swiperModules = [IonicSlides];

  @Input() category?: string;
  @Input() exercises: Exercise[] = [];

  @Output() onClick = new EventEmitter<Exercise>();

  onExerciseClick(exercise: Exercise) {
    this.onClick.emit(exercise);
  }
}
