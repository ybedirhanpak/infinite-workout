import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DarkModeToggleComponent } from './components/dark-mode-toggle/dark-mode-toggle.component';
import { PageLayoutComponent } from './components/page-layout/page-layout.component';

@NgModule({
  declarations: [PageLayoutComponent, DarkModeToggleComponent],
  imports: [IonicModule.forRoot()],
  exports: [PageLayoutComponent, DarkModeToggleComponent],
})
export class SharedModule {}
