import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DarkModeToggleComponent } from './components/dark-mode-toggle/dark-mode-toggle.component';
import { PageLayoutComponent } from './components/page-layout/page-layout.component';
import { RestTimePickerComponent } from './components/rest-time-picker/rest-time-picker.component';
import { WorkoutCardComponent } from './components/workout-card/workout-card.component';
import { WorkoutSlideComponent } from './components/workout-slide/workout-slide.component';
import { ClickableComponent } from './components/clickable/clickable.component';
import { ClockCircleComponent } from './components/clock-circle/clock-circle.component';
import { NgCircleProgressModule } from 'ng-circle-progress';



@NgModule({
  declarations: [
    PageLayoutComponent,
    DarkModeToggleComponent,
    RestTimePickerComponent,
    WorkoutCardComponent,
    WorkoutSlideComponent,
    ClickableComponent,
    ClockCircleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
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
      animateTitle: false,
      showInnerStroke: true,
      showSubtitle: false,
      showUnits: false,
      titleFontSize: '2.5rem',
      titleColor: 'var(--ion-text-color, black)',
      titleFontWeight: 'bold'
    }),
  ],
  exports: [
    PageLayoutComponent,
    DarkModeToggleComponent,
    RestTimePickerComponent,
    WorkoutCardComponent,
    WorkoutSlideComponent,
    ClickableComponent,
    ClockCircleComponent
  ],
})
export class SharedModule {}
