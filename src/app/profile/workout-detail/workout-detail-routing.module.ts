import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkoutDetailPage } from './workout-detail.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutDetailPageRoutingModule {}
