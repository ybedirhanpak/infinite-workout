import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  ModalController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { AddExerciseComponent } from '../add-exercise/add-exercise.component';
import { ProgressService } from '../progress.service';
import { Exercise } from '../exercise.model';
import { ExploreService } from '../../explore/explore.service';

@Component({
  selector: 'app-create-progress',
  templateUrl: './create-progress.page.html',
  styleUrls: ['./create-progress.page.scss'],
})
export class CreateProgressPage implements OnInit {
  form: FormGroup;
  repType: string = 'reps';
  exercises: Exercise[] = [];
  reorder = false;
  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private progressService: ProgressService,
    private navController: NavController,
    private exploreService: ExploreService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(20)],
      }),
      sets: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),
      reps: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),
    });
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
    }
  }

  reorderExercises(event: any) {
    const itemMove = this.exercises.splice(event.detail.from, 1)[0];
    this.exercises.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
  }

  onExerciseClick(exercise: Exercise) {
    this.exercises.forEach((ex) => {
      if (ex.name === exercise.name) {
        ex.selected = true;
      } else {
        ex.selected = false;
      }
    });
  }

  changeRepType() {
    if (this.repType == 'reps') {
      this.repType = 'sec';
    } else {
      this.repType = 'reps';
    }
  }

  createProgress() {
    this.loadingController
      .create({
        message: 'Creating...',
      })
      .then((loadingEl) => {
        loadingEl.present();

        const { name, sets, reps } = this.form.value;
        this.progressService
          .addProgress(name, sets, reps, this.repType, this.exercises)
          .subscribe((data) => {
            // loadingEl.dismiss();
            // this.form.reset();
            // this.navController.navigateBack('/home/progress');
          });

        this.exploreService
          .uploadProgress(name, sets, reps, this.repType, this.exercises)
          .subscribe((data) => {
            loadingEl.dismiss();
            this.form.reset();
            this.navController.navigateBack('/home/progress');
          });
      });
  }
}
