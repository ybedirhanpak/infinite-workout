import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

// Model
import { Exercise, Set, SetDetail } from '@models/exercise.model';

// Utils
import { getSetDetail } from '@utils/exercise.util';

@Component({
  selector: 'app-exercise-list-item',
  templateUrl: './exercise-list-item.component.html',
  styleUrls: ['./exercise-list-item.component.scss'],
})
export class ExerciseListItemComponent implements OnInit {
  @Input() exercise: Exercise;
  @Input() editable = false;

  @Output() onEditClick = new EventEmitter<Exercise>();

  sets: Set[] = [];
  setDetail: SetDetail;

  constructor() {}

  ngOnInit() {
    this.sets = this.exercise.set.sets;
    this.setDetail = getSetDetail(this.exercise);
  }

  onEditExerciseClick() {
    this.onEditClick.emit(this.exercise);
  }

  getLoadString(load: number | undefined) {
    return load && load !== 0 ? load : '--';
  }
}
