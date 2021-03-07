import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingPageRoutingModule } from './training-routing.module';

import { TrainingPage } from './training.page';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingPageRoutingModule,
    NgCircleProgressModule.forRoot({
      radius: 80,
      outerStrokeWidth: 12,
      innerStrokeWidth: 12,
      space: -12,
      outerStrokeColor: 'var(--ion-color-primary, black)',
      innerStrokeColor: 'var(--ion-color-step-200, gray)',
      responsive: true,
      renderOnClick: false,
      animation: false,
      animateTitle: true,
      showInnerStroke: true,
      showSubtitle: false,
      showUnits: false,
      titleFontSize: '2rem',
      titleColor: 'var(--ion-text-color, black)',
    }),
    SharedModule
  ],
  declarations: [TrainingPage]
})
export class TrainingPageModule {}
