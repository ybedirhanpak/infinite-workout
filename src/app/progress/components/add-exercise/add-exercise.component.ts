import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-exercise',
  templateUrl: './add-exercise.component.html',
  styleUrls: ['./add-exercise.component.scss'],
})
export class AddExerciseComponent implements OnInit {
  @ViewChild('addExerciseForm', { static: true }) addExerciseForm: NgForm;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  onCancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  onConfirm() {
    const name = this.addExerciseForm.value['exercise-name'];
    this.modalController.dismiss({ name }, 'confirm');
    this.addExerciseForm.reset();
  }
}
