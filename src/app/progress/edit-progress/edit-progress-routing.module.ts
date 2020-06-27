import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditProgressPage } from './edit-progress.page';

const routes: Routes = [
  {
    path: '',
    component: EditProgressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditProgressPageRoutingModule {}
