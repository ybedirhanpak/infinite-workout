import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExercisesPageRoutingModule } from './exercises-routing.module';

import { ExercisesPage } from './exercises.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExercisesPageRoutingModule,
    SharedModule
  ],
  declarations: [ExercisesPage]
})
export class ExercisesPageModule {}
