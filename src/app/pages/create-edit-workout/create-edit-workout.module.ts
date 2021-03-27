import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateEditWorkoutPageRoutingModule } from './create-edit-workout-routing.module';

import { CreateEditWorkoutPage } from './create-edit-workout.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreateEditWorkoutPageRoutingModule,
    SharedModule
  ],
  declarations: [CreateEditWorkoutPage]
})
export class CreateEditWorkoutPageModule {}
