import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateEditWorkoutPage } from './create-edit-workout.page';

const routes: Routes = [
  {
    path: '',
    component: CreateEditWorkoutPage
  },
  {
    path: 'exercises',
    loadChildren: () => import('../../exercises/exercises.module').then( m => m.ExercisesPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateEditWorkoutPageRoutingModule {}
