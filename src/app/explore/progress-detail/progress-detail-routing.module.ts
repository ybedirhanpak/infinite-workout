import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgressDetailPage } from './progress-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ProgressDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgressDetailPageRoutingModule {}
