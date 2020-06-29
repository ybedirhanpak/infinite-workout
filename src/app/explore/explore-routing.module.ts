import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExplorePage } from './explore.page';

const routes: Routes = [
  {
    path: '',
    component: ExplorePage,
  },
  {
    path: 'progress/:progressId',
    loadChildren: () =>
      import('./progress-detail/progress-detail.module').then(
        (m) => m.ProgressDetailPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExplorePageRoutingModule {}
