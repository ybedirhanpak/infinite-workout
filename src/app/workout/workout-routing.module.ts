import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkoutPage } from './workout.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutPage,
  },
  {
    path: 'history',
    loadChildren: () =>
      import('./workout-history/workout-history.module').then(
        (m) => m.WorkoutHistoryPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutPageRoutingModule {}
