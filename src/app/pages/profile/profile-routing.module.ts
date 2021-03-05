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
      import('./training-history/training-history.module').then(
        (m) => m.TrainingHistoryPageModule
      ),
  },
  {
    path: 'detail/:id',
    loadChildren: () =>
      import('./training-record/training-record.module').then(
        (m) => m.TrainingRecordPageModule
      ),
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
