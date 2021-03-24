import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExercisesPage } from './exercises.page';

const routes: Routes = [
  {
    path: '',
    component: ExercisesPage
  },
  {
    path: 'exercise-detail',
    loadChildren: () => import('../exercise-detail/exercise-detail.module').then(m => m.ExerciseDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExercisesPageRoutingModule {}
