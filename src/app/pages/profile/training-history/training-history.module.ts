import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TrainingHistoryPageRoutingModule } from './training-history-routing.module';
import { TrainingHistoryPage } from './training-history.page';

import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingHistoryPageRoutingModule,
    SharedModule
  ],
  declarations: [TrainingHistoryPage]
})
export class TrainingHistoryPageModule {}
