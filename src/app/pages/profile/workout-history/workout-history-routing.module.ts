import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkoutHistoryPage } from './workout-history.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutHistoryPageRoutingModule {}
