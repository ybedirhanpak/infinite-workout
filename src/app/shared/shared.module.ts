import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DarkModeToggleComponent } from './components/dark-mode-toggle/dark-mode-toggle.component';
import { PageLayoutComponent } from './components/page-layout/page-layout.component';
import { RestTimePickerComponent } from './components/rest-time-picker/rest-time-picker.component';

@NgModule({
  declarations: [
    PageLayoutComponent,
    DarkModeToggleComponent,
    RestTimePickerComponent,
  ],
  imports: [IonicModule.forRoot()],
  exports: [
    PageLayoutComponent,
    DarkModeToggleComponent,
    RestTimePickerComponent,
  ],
})
export class SharedModule {}
