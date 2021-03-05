import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyLibraryPageRoutingModule } from './my-library-routing.module';

import { MyLibraryPage } from './my-library.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyLibraryPageRoutingModule
  ],
  declarations: [MyLibraryPage]
})
export class MyLibraryPageModule {}
