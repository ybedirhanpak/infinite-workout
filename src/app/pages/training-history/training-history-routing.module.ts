import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingHistoryPage } from './training-history.page';

const routes: Routes = [
  {
    path: '',
    component: TrainingHistoryPage
  },
  {
    path: 'record/:id',
    loadChildren: () =>
      import('./training-record/training-record.module').then(
        (m) => m.TrainingRecordPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingHistoryPageRoutingModule {}
