import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkoutPageRoutingModule } from './workout-routing.module';

import { WorkoutPage } from './workout.page';

import { NgCircleProgressModule } from 'ng-circle-progress';

import { ToolbarPopoverComponent } from './toolbar-popover/toolbar-popover.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkoutPageRoutingModule,
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: '#78C000',
      innerStrokeColor: '#C7E596',
      animationDuration: 300,
      animation: false,
      responsive: true,
      renderOnClick: false,
    }),
  ],
  declarations: [WorkoutPage, ToolbarPopoverComponent],
})
export class WorkoutPageModule {}
