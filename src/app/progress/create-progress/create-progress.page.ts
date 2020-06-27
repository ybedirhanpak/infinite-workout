import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController, LoadingController } from '@ionic/angular';
import { AddExerciseComponent } from '../add-exercise/add-exercise.component';
import { ProgressService } from '../progress.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-progress',
  templateUrl: './create-progress.page.html',
  styleUrls: ['./create-progress.page.scss'],
})
export class CreateProgressPage implements OnInit {
  form: FormGroup;
  repType: string = 'reps';
  exercises: string[] = ['Pushup', 'Diamond Pushup'];

  reorder = false;
  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private progressService: ProgressService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
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
          this.exercises.push(exerciseName);
        }
      });
  }

  removeExercise(exercise: string) {
    const index = this.exercises.indexOf(exercise);
    if (index < 0) {
      return;
    }
    this.exercises.splice(index, 1);
  }

  reorderExercises(event: any) {
    const itemMove = this.exercises.splice(event.detail.from, 1)[0];
    this.exercises.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
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
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/', 'home', 'progress']);
          });
      });
  }
}
