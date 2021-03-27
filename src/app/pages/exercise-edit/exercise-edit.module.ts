import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExerciseEditPageRoutingModule } from './exercise-edit-routing.module';

import { ExerciseEditPage } from './exercise-edit.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    ExerciseEditPageRoutingModule,
    SharedModule
  ],
  declarations: [ExerciseEditPage]
})
export class ExerciseEditPageModule {}
