import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
  },
  {
    path: 'history',
    loadChildren: () =>
      import('./workout-history/workout-history.module').then(
        (m) => m.WorkoutHistoryPageModule
      ),
  },
  {
    path: 'detail/:workoutId',
    loadChildren: () =>
      import('./workout-detail/workout-detail.module').then(
        (m) => m.WorkoutDetailPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
