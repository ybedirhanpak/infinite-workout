import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgressPage } from './progress.page';

const routes: Routes = [
  {
    path: '',
    component: ProgressPage,
  },
  {
    path: 'create',
    loadChildren: () =>
      import('./create-progress/create-progress.module').then(
        (m) => m.CreateProgressPageModule
      ),
  },
  {
    path: 'edit/:progressId',
    loadChildren: () =>
      import('./edit-progress/edit-progress.module').then(
        (m) => m.EditProgressPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgressPageRoutingModule {}
