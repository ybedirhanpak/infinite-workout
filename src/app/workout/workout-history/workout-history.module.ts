import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkoutHistoryPageRoutingModule } from './workout-history-routing.module';

import { WorkoutHistoryPage } from './workout-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkoutHistoryPageRoutingModule
  ],
  declarations: [WorkoutHistoryPage]
})
export class WorkoutHistoryPageModule {}
