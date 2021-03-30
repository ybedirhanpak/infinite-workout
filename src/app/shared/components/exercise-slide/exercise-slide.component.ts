import { Component, EventEmitter, Input, Output } from '@angular/core';

// Model
import { Exercise } from '@models/exercise.model';

@Component({
  selector: 'app-exercise-slide',
  templateUrl: './exercise-slide.component.html',
  styleUrls: ['./exercise-slide.component.scss'],
})
export class ExerciseSlideComponent {
  @Input() category: string;
  @Input() exercises: Exercise[] = [];

  @Output() onClick = new EventEmitter<Exercise>();

  slideOptions = {
    initialSlide: 0,
    speed: 500,
    slidesPerView: 2.1,
    spaceBetween: 12,
    centerSlide: false,
  };

  onExerciseClick(exercise: Exercise) {
    this.onClick.emit(exercise);
  }
}
