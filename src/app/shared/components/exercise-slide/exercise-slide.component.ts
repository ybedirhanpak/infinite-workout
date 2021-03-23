import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

// Model
import { Exercise } from '@models/exercise.model';

@Component({
  selector: 'app-exercise-slide',
  templateUrl: './exercise-slide.component.html',
  styleUrls: ['./exercise-slide.component.scss'],
})
export class ExerciseSlideComponent implements OnInit {
  @Input() category: string = 'Category';
  @Input() exercises: Exercise[] = [];
  @Input() filter: string = 'red-turquoise';

  @Output() onClick = new EventEmitter<Exercise>();

  slideOptions = {
    initialSlide: 0,
    speed: 500,
    slidesPerView: 2.2,
    spaceBetween: 12,
    centerSlide: false
  };

  ngOnInit() {
    if (this.exercises.length > 1) {
      this.slideOptions.slidesPerView = 2.2;
      this.slideOptions.centerSlide = false;
    } else {
      this.slideOptions.slidesPerView = 1.2;
      this.slideOptions.centerSlide = true;
    }
  }

  onExerciseClick(exercise: Exercise) {
    this.onClick.emit(exercise);
  }
}
