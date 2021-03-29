import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImageGalleryPageRoutingModule } from './image-gallery-routing.module';

import { ImageGalleryPage } from './image-gallery.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageGalleryPageRoutingModule,
    SharedModule
  ],
  declarations: [ImageGalleryPage]
})
export class ImageGalleryPageModule {}
