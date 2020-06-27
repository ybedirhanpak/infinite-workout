import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ModalController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { ProgressService } from '../progress.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AddExerciseComponent } from '../add-exercise/add-exercise.component';
import { ActivatedRoute } from '@angular/router';
import { Progress } from '../progress.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-progress',
  templateUrl: './edit-progress.page.html',
  styleUrls: ['./edit-progress.page.scss'],
})
export class EditProgressPage implements OnInit, OnDestroy {
  progress: Progress;
  progressSub: Subscription;
  isLoading = false;
  form: FormGroup;
  repType: string = 'reps';
  exercises: string[] = [];
  reorder = false;
  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private progressService: ProgressService,
    private navController: NavController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('progressId')) {
        this.navController.navigateBack('/home/progress');
        return;
      }
      this.isLoading = true;
      this.progressSub = this.progressService
        .getProgress(parseInt(paramMap.get('progressId')))
        .subscribe((progress) => {
          this.progress = progress;

          if (!this.progress) {
            // TODO SHOW ERROR
            return;
          }
          const { name, sets, reps, repType, exercises } = this.progress;

          this.exercises = exercises;
          this.repType = repType;

          this.form = new FormGroup({
            name: new FormControl(name, {
              updateOn: 'blur',
              validators: [Validators.required],
            }),
            sets: new FormControl(sets, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.min(1)],
            }),
            reps: new FormControl(reps, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.min(1)],
            }),
          });

          this.isLoading = false;
        });
    });
  }

  ngOnDestroy() {
    this.progressSub.unsubscribe();
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

  updateProgress() {
    this.loadingController
      .create({
        message: 'Creating...',
      })
      .then((loadingEl) => {
        loadingEl.present();

        const { name, sets, reps } = this.form.value;
        // TODO IMPLEMENT update progress
        // this.progressService
        //   .addProgress(name, sets, reps, this.repType, this.exercises)
        //   .subscribe((data) => {
        //     loadingEl.dismiss();
        //     this.form.reset();
        //     this.navController.navigateBack('/home/progress');
        //   });
      });
  }
}
