import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      {
        path: 'explore',
        loadChildren: () =>
          import('../explore/explore.module').then((m) => m.ExplorePageModule),
      },
      {
        path: 'my-library',
        loadChildren: () =>
          import('../../pages/my-library/my-library.module').then(
            (m) => m.MyLibraryPageModule
          ),
      },
      {
        path: 'training-history',
        loadChildren: () =>
          import('../../pages/training-history/training-history.module').then(
            (m) => m.TrainingHistoryPageModule
          ),
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: '',
        redirectTo: '/home/my-library',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/home/my-library',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
