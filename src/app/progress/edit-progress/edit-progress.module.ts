import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditProgressPageRoutingModule } from './edit-progress-routing.module';

import { EditProgressPage } from './edit-progress.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    EditProgressPageRoutingModule,
    SharedModule,
  ],
  declarations: [EditProgressPage],
})
export class EditProgressPageModule {}
