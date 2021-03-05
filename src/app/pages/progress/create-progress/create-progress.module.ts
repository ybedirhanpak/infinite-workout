import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateProgressPageRoutingModule } from './create-progress-routing.module';

import { CreateProgressPage } from './create-progress.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    CreateProgressPageRoutingModule,
    SharedModule,
  ],
  declarations: [CreateProgressPage],
})
export class CreateProgressPageModule {}
