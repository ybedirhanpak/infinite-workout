import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  ModalController,
  LoadingController,
  NavController,
} from '@ionic/angular';

// Model
import { Exercise } from '../../../models/exercise.model';

// Service
import { ProgressService } from '../../../services/progress.service';

// Component
import { AddExerciseComponent } from '../components/add-exercise/add-exercise.component';

@Component({
  selector: 'app-create-progress',
  templateUrl: './create-progress.page.html',
  styleUrls: ['./create-progress.page.scss'],
})
export class CreateProgressPage implements OnInit {
  form: FormGroup;
  repType = 'reps';
  exercises: Exercise[] = [];
  reorder = false;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private progressService: ProgressService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.maxLength(20)],
      }),
      sets: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.min(1)],
      }),
      reps: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.min(1)],
      }),
    });
  }

  /**
   * Opens add exercise modal and adds resulting exercise to progress
   */
  addExercise() {
    this.modalController
      .create({
        component: AddExerciseComponent,
      })
      .then((modal) => {
        modal.present();
        return modal.onDidDismiss();
      })
      .then((resultData) => {
        if (resultData.role === 'confirm') {
          const exerciseName = resultData.data.name;
          const index = this.exercises.findIndex(
            (e) => e.name === exerciseName
          );
          if (index < 0) {
            const selected = this.exercises.length === 0;
            this.exercises.push(new Exercise(exerciseName, selected));
          }
        }
      });
  }

  /**
   * Removes an exercise from progress
   * @param exercise exercise to be removed
   */
  removeExercise(exercise: Exercise) {
    const ex = this.exercises.find((e) => e.name === exercise.name);
    if (ex) {
      this.exercises = this.exercises.filter((e) => e.name !== ex.name);
      if (ex.selected && this.exercises.length > 0) {
        this.exercises[0].selected = true;
      }
    }
  }

  /**
   * Changes order of exercise list
   * @param event change in exercise list's order
   */
  reorderExercises(event: any) {
    const itemMove = this.exercises.splice(event.detail.from, 1)[0];
    this.exercises.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
  }

  /**
   * Makes an exercise "selected exercise"
   * @param exercise clicked exercise
   */
  onExerciseClick(exercise: Exercise) {
    this.exercises.forEach((ex) => {
      if (ex.name === exercise.name) {
        ex.selected = true;
      } else {
        ex.selected = false;
      }
    });
  }

  /**
   * Changes rep type of progress
   */
  changeRepType() {
    if (this.repType === 'reps') {
      this.repType = 'sec';
    } else {
      this.repType = 'reps';
    }
  }

  /**
   * Creates progress
   */
  createProgress() {
    this.loadingController
      .create({
        message: 'Creating...',
      })
      .then((loading) => {
        loading.present();
        const { name, sets, reps } = this.form.value;
        this.progressService
          .saveProgress(name, sets, reps, this.repType, this.exercises)
          .then(() => {
            this.form.reset();
            this.navController.navigateBack('/home/progress');
          })
          .catch(() => {
            // TODO: Display error message
          })
          .finally(() => {
            loading.dismiss();
          });
      });
  }
}
