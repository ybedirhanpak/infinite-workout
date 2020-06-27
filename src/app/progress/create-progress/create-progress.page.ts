import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AddExerciseComponent } from '../add-exercise/add-exercise.component';

@Component({
  selector: 'app-create-progress',
  templateUrl: './create-progress.page.html',
  styleUrls: ['./create-progress.page.scss'],
})
export class CreateProgressPage implements OnInit {
  form: FormGroup;
  repType: 'reps' | 'sec' = 'reps';
  exercises: string[] = ['Pushup', 'Diamond Pushup'];

  reorder = false;
  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
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

  reorderExercises(ev) {
    const itemMove = this.exercises.splice(ev.detail.from, 1)[0];
    this.exercises.splice(ev.detail.to, 0, itemMove);
    ev.detail.complete();
    console.log('Exercises', this.exercises);
  }
}
