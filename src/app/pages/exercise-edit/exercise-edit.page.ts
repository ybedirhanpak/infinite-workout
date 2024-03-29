import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';

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
  @Input() isModal = false;
  @Input() fromEdit = false;

  exercise!: Exercise;
  sets!: Set[];
  suggestedSet: Set = { load: 0, rep: 0 };
  setDetail!: SetDetail;

  constructor(
    private exerciseService: ExerciseService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.exerciseService.exerciseDetail.get().subscribe((exercise) => {
      this.exercise = exercise!;
      this.setDetail = getSetDetail(this.exercise);
      this.sets = this.exercise.set.sets;
    });
  }

  onAddClick() {
    const lastSet =
      this.sets.length > 0 ? this.sets[this.sets.length - 1] : undefined;

    if (lastSet) {
      this.sets.push({
        ...lastSet,
        checked: false,
      });
    } else {
      const defaultSet = getDefaultSet(this.exercise);
      this.sets.push({
        ...defaultSet,
        checked: false,
      });
    }
  }

  onDeleteClick(i: number) {
    this.sets.splice(i, 1);
  }

  onSaveClick() {
    if (this.isModal) {
      this.modalCtrl.dismiss({
        exercise: this.exercise,
        role: 'save',
      });
    } else {
      const editWorkout = this.router.url.includes('edit-workout');
      this.exercise.set.sets = this.sets;
      this.exerciseService.editedExercise.set(this.exercise);
      if (editWorkout) {
        this.navCtrl.navigateBack('/workout-detail/edit-workout');
      } else {
        this.navCtrl.navigateBack('/create-workout');
      }
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
