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
        path: 'training',
        loadChildren: () =>
          import('../training/training.module').then((m) => m.TrainingPageModule),
      },
      {
        path: 'explore',
        loadChildren: () =>
          import('../explore/explore.module').then((m) => m.ExplorePageModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
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
    redirectTo: '/home/training',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
