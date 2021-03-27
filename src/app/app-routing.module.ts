import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'training',
    loadChildren: () =>
      import('./pages/training/training.module').then(
        (m) => m.TrainingPageModule
      ),
  },
  {
    path: 'workouts',
    loadChildren: () =>
      import('./pages/workouts/workouts.module').then(
        (m) => m.WorkoutsPageModule
      ),
  },
  {
    path: 'exercises',
    loadChildren: () =>
      import('./pages/exercises/exercises.module').then(
        (m) => m.ExercisesPageModule
      ),
  },
  {
    path: 'workout-detail',
    loadChildren: () =>
      import('./pages/workout-detail/workout-detail.module').then(
        (m) => m.WorkoutDetailPageModule
      ),
  },
  {
    path: 'exercise-detail',
    loadChildren: () =>
      import('./pages/exercise-detail/exercise-detail.module').then(
        (m) => m.ExerciseDetailPageModule
      ),
  },
  {
    path: 'create-workout',
    loadChildren: () =>
      import('./pages/create-edit-workout/create-edit-workout.module').then(
        (m) => m.CreateEditWorkoutPageModule
      ),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
