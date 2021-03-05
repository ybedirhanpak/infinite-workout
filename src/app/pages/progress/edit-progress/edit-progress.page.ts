import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  LoadingController,
  NavController,
  AlertController,
} from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// Model
import { Progress } from '@models/progress.model';
import { Exercise } from '@models/exercise.model';

// Service
import { ProgressService } from '@services/progress.service';

// Component
import { AddExerciseComponent } from '../components/add-exercise/add-exercise.component';

@Component({
  selector: 'app-edit-progress',
  templateUrl: './edit-progress.page.html',
  styleUrls: ['./edit-progress.page.scss'],
})
export class EditProgressPage implements OnInit {
  /** Progress Detail */
  progress: Progress;
  isLoading = false;
  form: FormGroup;
  repType = 'reps';
  exercises: Exercise[] = [];
  reorder = false;
  progressChanged = false;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private progressService: ProgressService,
    private navController: NavController,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('progressId')) {
        this.navController.navigateBack('/home/progress');
        return;
      }
      this.isLoading = true;

      this.progressService
        .getProgress(parseInt(paramMap.get('progressId'), 10))
        .then((progress) => {
          this.progress = progress;

          if (!this.progress) {
            return;
          }
          const { name, sets, reps, repType, exercises } = this.progress;

          this.exercises = exercises;
          this.repType = repType;

          this.form = new FormGroup({
            name: new FormControl(name, {
              updateOn: 'change',
              validators: [Validators.required, Validators.maxLength(20)],
            }),
            sets: new FormControl(sets, {
              updateOn: 'change',
              validators: [Validators.required, Validators.min(1)],
            }),
            reps: new FormControl(reps, {
              updateOn: 'change',
              validators: [Validators.required, Validators.min(1)],
            }),
          });

          this.form.valueChanges.subscribe(() => {
            this.progressChanged = true;
          });
        })
        .catch(() => {
          // TODO: Display error message
        })
        .finally(() => {
          this.isLoading = false;
        });
    });
  }

  /**
   * Executes behavior of back button.
   * Displays an alert to show user three options: Save, Discard, Cancel
   */
  goBack() {
    if (this.progressChanged) {
      this.alertController
        .create({
          header: 'Are you sure?',
          message: 'Do you want to save the changes?',
          buttons: [
            {
              text: 'Save',
              handler: () => this.updateProgress(),
            },
            {
              text: 'Discard',
              handler: () => this.navController.navigateBack('/home/progress'),
            },
            {
              text: 'Cancel',
              role: 'cancel',
            },
          ],
        })
        .then((alert) => {
          alert.present();
        });
    } else {
      this.navController.navigateBack('/home/progress');
    }
  }

  /**
   * Opens add exercise modal.
   * After modal operation ends, adds exercise to progress
   */
  addExercise() {
    this.modalController
      .create({
        component: AddExerciseComponent,
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
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
            this.progressChanged = true;
          }
        }
      });
  }

  /**
   * Removes exercise from progresss
   * @param exercise exercise to be removed
   */
  removeExercise(exercise: Exercise) {
    const ex = this.exercises.find((e) => e.name === exercise.name);
    if (ex) {
      this.exercises = this.exercises.filter((e) => e.name !== ex.name);
      if (ex.selected && this.exercises.length > 0) {
        this.exercises[0].selected = true;
      }
      this.progressChanged = true;
    }
  }

  /**
   * Executed when exercise list is reordered.
   * Updates exercise list in progress according to reorder operation.
   * @param event change in order of exercise list of progress
   */
  reorderExercises(event: any) {
    const itemMove = this.exercises.splice(event.detail.from, 1)[0];
    this.exercises.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
    this.progressChanged = true;
  }

  /**
   * Executes behavior of click on an exercise.
   * Sets an exercise to be selected exercise.
   * @param exercise exercise that is clicked on
   */
  onExerciseClick(exercise: Exercise) {
    if (this.reorder) {
      return;
    }
    this.exercises.forEach((ex) => {
      if (ex.name === exercise.name) {
        ex.selected = true;
      } else {
        ex.selected = false;
      }
    });
    this.progressChanged = true;
  }

  /**
   * Changes rep type of the progress
   * Rep type can be either 'reps' or 'sec'
   */
  changeRepType() {
    if (this.repType === 'reps') {
      this.repType = 'sec';
    } else {
      this.repType = 'reps';
    }
    this.progressChanged = true;
  }

  /**
   * Updates progress with updated form values and exercise list
   */
  updateProgress() {
    if (this.form.invalid) {
      return;
    }
    this.loadingController
      .create({
        message: 'Updating...',
      })
      .then((loading) => {
        loading.present();
        const { name, sets, reps } = this.form.value;
        this.progressService
          .updateProgress(
            this.progress.id,
            name,
            sets,
            reps,
            this.repType,
            this.exercises
          )
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
