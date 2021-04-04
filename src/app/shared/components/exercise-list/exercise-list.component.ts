import { Component, EventEmitter, Input, Output } from '@angular/core';

// Model
import { Exercise } from '@models/exercise.model';

// Util
import { getSetDetail } from '@utils/exercise.util';

@Component({
  selector: 'app-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.scss'],
})
export class ExerciseListComponent {
  @Input() exercises: Exercise[];
  @Input() reorder = false;
  @Input() editable = false;

  @Output() onEditClick = new EventEmitter<Exercise>();
  @Output() onDeleteClick = new EventEmitter<Exercise>();
  @Output() onReorder = new EventEmitter<any>();

  constructor() {}

  onEditExerciseClick(exercise: Exercise) {
    this.onEditClick.emit(exercise);
  }

  onDeleteExerciseClick(exercise: Exercise) {
    this.onDeleteClick.emit(exercise);
  }

  onReorderExercise(event) {
    this.onReorder.emit(event);
  }

  getDetail(exercise: Exercise) {
    return getSetDetail(exercise);
  }

  getLoadStringUI(load: number | string | undefined) {
    return load && load !== 0 && load !== '0' ? load : '--';
  }
}
