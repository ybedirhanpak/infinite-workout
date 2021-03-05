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



@NgModule({
  declarations: [
    PageLayoutComponent,
    DarkModeToggleComponent,
    RestTimePickerComponent,
    WorkoutCardComponent,
    WorkoutSlideComponent,
    ClickableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot()
  ],
  exports: [
    PageLayoutComponent,
    DarkModeToggleComponent,
    RestTimePickerComponent,
    WorkoutCardComponent,
    WorkoutSlideComponent,
    ClickableComponent
  ],
})
export class SharedModule {}
