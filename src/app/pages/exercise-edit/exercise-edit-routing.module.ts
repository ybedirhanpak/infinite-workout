import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExerciseEditPage } from './exercise-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ExerciseEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExerciseEditPageRoutingModule {}
