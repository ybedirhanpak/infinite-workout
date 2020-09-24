import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ModalController,
  LoadingController,
  NavController,
  AlertController,
} from '@ionic/angular';
import { ProgressService } from '../services/progress.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AddExerciseComponent } from '../components/add-exercise/add-exercise.component';
import { ActivatedRoute } from '@angular/router';
import { Progress } from '../models/progress.model';
import { Subscription } from 'rxjs';
import { Exercise } from '../models/exercise.model';

@Component({
  selector: 'app-edit-progress',
  templateUrl: './edit-progress.page.html',
  styleUrls: ['./edit-progress.page.scss'],
})
export class EditProgressPage implements OnInit, OnDestroy {
  paramSub: Subscription;
  progress: Progress;
  progressSub: Subscription;
  isLoading = false;
  form: FormGroup;
  repType: string = 'reps';
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
    this.paramSub = this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('progressId')) {
        this.navController.navigateBack('/home/progress');
        return;
      }
      this.isLoading = true;
      this.progressSub = this.progressService
        .getProgress(parseInt(paramMap.get('progressId')))
        .subscribe(
          (progress) => {
            this.progress = progress;

            if (!this.progress) {
              this.showErrorModal();
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

            this.isLoading = false;
          },
          (error) => {
            this.showErrorModal();
            this.isLoading = false;
          }
        );
    });
  }

  ngOnDestroy() {
    if (this.progressSub) {
      this.progressSub.unsubscribe();
    }
    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }
  }

  goBack() {
    if (this.progressChanged) {
      this.alertController.create({
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
      }).then((alert) => {
        alert.present();
      });
    } else {
      this.navController.navigateBack('/home/progress');
    }
  }

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

  removeExercise(exercise: Exercise) {
    const ex = this.exercises.find((e) => e.name == exercise.name);
    if (ex) {
      this.exercises = this.exercises.filter((e) => e.name !== ex.name);
      if (ex.selected && this.exercises.length > 0) {
        this.exercises[0].selected = true;
      }
      this.progressChanged = true;
    }
  }

  reorderExercises(event: any) {
    const itemMove = this.exercises.splice(event.detail.from, 1)[0];
    this.exercises.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
    this.progressChanged = true;
  }

  onExerciseClick(exercise: Exercise) {
    this.exercises.forEach((ex) => {
      if (ex.name === exercise.name) {
        ex.selected = true;
      } else {
        ex.selected = false;
      }
    });
    this.progressChanged = true;
  }

  changeRepType() {
    if (this.repType == 'reps') {
      this.repType = 'sec';
    } else {
      this.repType = 'reps';
    }
    this.progressChanged = true;
  }

  updateProgress() {
    if (this.form.invalid) {
      return;
    }
    this.loadingController
      .create({
        message: 'Updating...',
      })
      .then((loadingEl) => {
        loadingEl.present();

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
          .subscribe((data) => {
            loadingEl.dismiss();
            this.form.reset();
            this.navController.navigateBack('/home/progress');
          });
      });
  }

  showErrorModal() {
    this.alertController
      .create({
        header: 'Error occured.',
        message: 'Please try again.',
        buttons: [
          {
            text: 'Okay',
            handler: () => this.navController.navigateBack('/home/progress'),
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }
}
