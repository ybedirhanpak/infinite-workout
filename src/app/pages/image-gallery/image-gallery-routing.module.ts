import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImageGalleryPage } from './image-gallery.page';

const routes: Routes = [
  {
    path: '',
    component: ImageGalleryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImageGalleryPageRoutingModule {}
