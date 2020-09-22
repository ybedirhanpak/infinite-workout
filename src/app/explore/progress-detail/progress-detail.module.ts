import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgressDetailPageRoutingModule } from './progress-detail-routing.module';

import { ProgressDetailPage } from './progress-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgressDetailPageRoutingModule,
    SharedModule,
  ],
  declarations: [ProgressDetailPage],
})
export class ProgressDetailPageModule {}
