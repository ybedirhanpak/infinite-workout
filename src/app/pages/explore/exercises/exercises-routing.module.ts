import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExercisesPage } from './exercises.page';

const routes: Routes = [
  {
    path: '',
    component: ExercisesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExercisesPageRoutingModule {}
