import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExerciseDetailPage } from './exercise-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ExerciseDetailPage
  },
  {
    path: 'exercise-edit',
    loadChildren: () => import('./exercise-edit/exercise-edit.module').then( m => m.ExerciseEditPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExerciseDetailPageRoutingModule {}
