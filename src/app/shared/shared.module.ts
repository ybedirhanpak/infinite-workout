import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgCircleProgressModule } from 'ng-circle-progress';

// Directives
import { SelectAllDirective } from './directives/select-all.directive';

// Components
import { DarkModeToggleComponent } from './components/dark-mode-toggle/dark-mode-toggle.component';
import { PageLayoutComponent } from './components/page-layout/page-layout.component';
import { RestTimePickerComponent } from './components/rest-time-picker/rest-time-picker.component';
import { CardMediumComponent } from './components/card-medium/card-medium.component';
import { WorkoutSlideComponent } from './components/workout-slide/workout-slide.component';
import { ClickableComponent } from './components/clickable/clickable.component';
import { ClockCircleComponent } from './components/clock-circle/clock-circle.component';
import { HighlightCardComponent } from './components/highlight-card/highlight-card.component';
import { HighlightWorkoutSlideComponent } from './components/highlight-workout-slide/highlight-workout-slide.component';
import { ExerciseSlideComponent } from './components/exercise-slide/exercise-slide.component';
import { ExerciseListSkeletonComponent } from './components/exercise-list-skeleton/exercise-list-skeleton.component';
import { ExerciseListComponent } from './components/exercise-list/exercise-list.component';

@NgModule({
  declarations: [
    PageLayoutComponent,
    DarkModeToggleComponent,
    RestTimePickerComponent,
    CardMediumComponent,
    WorkoutSlideComponent,
    ClickableComponent,
    ClockCircleComponent,
    HighlightCardComponent,
    HighlightWorkoutSlideComponent,
    ExerciseSlideComponent,
    SelectAllDirective,
    ExerciseListSkeletonComponent,
    ExerciseListComponent
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
      titleFontWeight: 'bold',
    }),
  ],
  exports: [
    PageLayoutComponent,
    DarkModeToggleComponent,
    RestTimePickerComponent,
    CardMediumComponent,
    WorkoutSlideComponent,
    ClickableComponent,
    ClockCircleComponent,
    HighlightCardComponent,
    HighlightWorkoutSlideComponent,
    ExerciseSlideComponent,
    SelectAllDirective,
    ExerciseListSkeletonComponent,
    ExerciseListComponent
  ],
})
export class SharedModule {}
