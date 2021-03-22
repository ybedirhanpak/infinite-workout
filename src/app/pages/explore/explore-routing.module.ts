import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExplorePage } from './explore.page';

const routes: Routes = [
  {
    path: '',
    component: ExplorePage,
  },
  {
    path: 'workout-detail',
    loadChildren: () => import('../workout-detail/workout-detail.module').then( m => m.WorkoutDetailPageModule)
  },
  {
    path: 'exercises',
    loadChildren: () => import('./exercises/exercises.module').then( m => m.ExercisesPageModule)
  },
  {
    path: 'workouts',
    loadChildren: () => import('./workouts/workouts.module').then( m => m.WorkoutsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExplorePageRoutingModule {}
