import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgressPageRoutingModule } from './progress-routing.module';

import { ProgressPage } from './progress.page';

import { AddExerciseComponent } from './add-exercise/add-exercise.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgressPageRoutingModule,
    SharedModule,
  ],
  declarations: [ProgressPage, AddExerciseComponent],
})
export class ProgressPageModule {}
