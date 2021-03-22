import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkoutsPage } from './workouts.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutsPageRoutingModule {}
