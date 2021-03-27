import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

// Model
import { Exercise, Set, SetDetail } from '@models/exercise.model';

// Service
import { ExerciseService } from '@services/exercise.service';

// Utils
import { getSetDetail, getDefaultSet } from '@utils/exercise.util';

@Component({
  selector: 'app-exercise-edit',
  templateUrl: './exercise-edit.page.html',
  styleUrls: ['./exercise-edit.page.scss'],
})
export class ExerciseEditPage implements OnInit {
  @Input() fromEdit = false;

  exercise: Exercise;
  sets: Set[];
  suggestedSet: Set = { load: undefined, rep: undefined };
  setDetail: SetDetail;

  constructor(
    private exerciseService: ExerciseService,
    private navCtrl: NavController,
    private router: Router
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.exerciseService.exerciseDetail.subscribe((exercise) => {
      this.exercise = exercise;
      this.setDetail = getSetDetail(exercise);
      this.sets = this.exercise.set.sets;
    });
  }

  onAddClick() {
    const lastSet =
      this.sets.length > 0 ? this.sets[this.sets.length - 1] : undefined;

    if (lastSet) {
      this.sets.push(lastSet);
    } else {
      const defaultSet = getDefaultSet(this.exercise);
      this.sets.push({
        load: defaultSet[this.setDetail.load],
        rep: defaultSet[this.setDetail.rep],
      });
    }
  }

  onDeleteClick(i: number) {
    this.sets.splice(i, 1);
  }

  onSaveClick() {
    const editWorkout = this.router.url.includes('edit-workout');
    this.exercise.set.sets = this.sets;
    this.exerciseService.setEditedExercise(this.exercise);
    if(editWorkout) {
      this.navCtrl.navigateBack("/workout-detail/edit-workout");
    } else {
      // this.navCtrl.navigateBack("/workout-detail/edit-workout");
    }
  }

  onBlur(event: any, key: 'load' | 'rep') {
    const val = event.target.value;
    const suggestedVal = this.suggestedSet[key];

    if (suggestedVal === undefined && val !== undefined) {
      this.sets.forEach((set) => {
        if (set[key] === undefined) {
          set[key] = val;
        }
      });

      // Update suggested
      this.suggestedSet[key] = val;
    }
  }
}
