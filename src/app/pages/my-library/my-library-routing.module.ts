import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyLibraryPage } from './my-library.page';

const routes: Routes = [
  {
    path: '',
    component: MyLibraryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyLibraryPageRoutingModule {}
