import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingHistoryPage } from './training-history.page';

const routes: Routes = [
  {
    path: '',
    component: TrainingHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingHistoryPageRoutingModule {}
