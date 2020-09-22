import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PageLayoutComponent } from './components/page-layout/page-layout.component';

@NgModule({
  declarations: [PageLayoutComponent],
  imports: [IonicModule.forRoot()],
  exports: [PageLayoutComponent],
})
export class SharedModule {}
