import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkoutDetailPage } from './workout-detail.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutDetailPage
  },
  {
    path: 'exercise-edit',
    loadChildren: () => import('../exercise-detail/exercise-edit/exercise-edit.module').then( m => m.ExerciseEditPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutDetailPageRoutingModule {}
