import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingRecordPage } from './training-record.page';

const routes: Routes = [
  {
    path: '',
    component: TrainingRecordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingRecordPageRoutingModule {}
