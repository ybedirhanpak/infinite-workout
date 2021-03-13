import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingRecordPageRoutingModule } from './training-record-routing.module';

import { TrainingRecordPage } from './training-record.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingRecordPageRoutingModule,
    SharedModule
  ],
  declarations: [TrainingRecordPage]
})
export class TrainingRecordPageModule {}
