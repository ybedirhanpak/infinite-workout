import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateProgressPage } from './create-progress.page';

const routes: Routes = [
  {
    path: '',
    component: CreateProgressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateProgressPageRoutingModule {}
