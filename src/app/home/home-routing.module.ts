import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      {
        path: 'progress',
        loadChildren: () =>
          import('../progress/progress.module').then(
            (m) => m.ProgressPageModule
          ),
      },
      {
        path: 'workout',
        loadChildren: () =>
          import('../workout/workout.module').then((m) => m.WorkoutPageModule),
      },
      {
        path: 'explore',
        loadChildren: () =>
          import('../explore/explore.module').then((m) => m.ExplorePageModule),
      },
      {
        path: '',
        redirectTo: '/home/progress',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/home/workout',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
