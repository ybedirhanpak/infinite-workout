import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyLibraryPage } from './my-library.page';

const routes: Routes = [
  {
    path: '',
    component: MyLibraryPage
  },
  {
    path: 'workout-detail',
    loadChildren: () => import('../workout-detail/workout-detail.module').then( m => m.WorkoutDetailPageModule)
  },
  {
    path: 'create-workout',
    loadChildren: () => import('./create-edit-workout/create-edit-workout.module').then( m => m.CreateEditWorkoutPageModule)
  },
  {
    path: 'edit-workout/:id',
    loadChildren: () => import('./create-edit-workout/create-edit-workout.module').then( m => m.CreateEditWorkoutPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyLibraryPageRoutingModule {}
