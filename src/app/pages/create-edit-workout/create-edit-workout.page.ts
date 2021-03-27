import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';

// Model
import { Workout } from '@models/workout.model';
import { Exercise } from '@models/exercise.model';

// Service
import { ExerciseService } from '@services/exercise.service';
import { WorkoutService } from '@services/workout.service';

// Utils
import { copyFrom } from '@utils/object.util';
import { getEmptyWorkout } from '@utils/workout.util';

@Component({
  selector: 'app-create-edit-workout',
  templateUrl: './create-edit-workout.page.html',
  styleUrls: ['./create-edit-workout.page.scss'],
})
export class CreateEditWorkoutPage implements OnInit {
  mode: 'create' | 'edit' = 'create';
  workout: Workout;
  created = false;
  customized = false;
  formGroup: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private exerciseService: ExerciseService,
    private workoutService: WorkoutService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    const editMode = this.router.url.includes('edit-workout');
    if (editMode) {
      // Edit Mode
      this.mode = 'edit';
      this.workoutService.workoutEdit.get().subscribe(async (workout) => {
        this.workout = workout;

        this.formGroup = new FormGroup({
          name: new FormControl(workout.name),
          duration: new FormControl(workout.duration),
          category: new FormControl(workout.category),
          equipments: new FormControl(workout.equipments),
        });

        this.created = await this.workoutService.createdWorkouts.contains(
          workout
        );

        this.customized = await this.workoutService.customizedWorkouts.contains(
          workout
        );
      });
    } else {
      // Create Mode
      this.mode = 'create';
      this.workout = getEmptyWorkout(Date.now());
      this.workout.exercises = [];
      this.formGroup = new FormGroup({
        name: new FormControl(''),
        duration: new FormControl(''),
        category: new FormControl(''),
        equipments: new FormControl(''),
      });
    }
  }

  getTitle() {
    return this.mode === 'create' ? 'Create Workout' : 'Edit Workout';
  }

  ionViewWillEnter() {
    if (this.workout) {
      this.exerciseService.editedExercise.subscribe((exercise) => {
        if (exercise) {
          const oldExercise = this.workout.exercises.find(
            (e) => e.id === exercise.id
          );
          if (oldExercise) {
            copyFrom(exercise, oldExercise);
          } else {
            this.workout.exercises.push(exercise);
          }
        }
      });
    }
  }

  onAddExerciseClick() {
    const navigateUrl = `${this.router.url}/exercises`;
    this.router.navigateByUrl(navigateUrl);
  }

  onEditExerciseClick(exercise: Exercise) {
    this.exerciseService.setExerciseDetail(exercise);
    const navigateUrl = `${this.router.url}/exercise-edit`;
    this.router.navigateByUrl(navigateUrl);
  }

  async onSaveClick() {
    const workoutToSave = {
      imageUrl: '/assets/img/workout/mix-workout.jpg',
      ...this.workout,
      ...this.formGroup.value,
    };

    if (this.mode === 'create') {
      this.workoutService.createdWorkouts.create(workoutToSave);
      this.navCtrl.navigateBack('/home/my-library');
    } else if (this.mode === 'edit') {
      if (this.created) {
        this.workoutService.createdWorkouts.update(workoutToSave);
      } else if (this.customized) {
        this.workoutService.customizedWorkouts.update(workoutToSave);
      } else {
        this.workoutService.customizedWorkouts.create(workoutToSave);
      }
      this.workoutService.workoutDetail.set(workoutToSave);
      this.navCtrl.navigateBack('/workout-detail');
    }

    // TODO: Display toast message
  }

  async onDeleteClick() {
    // TODO: Ask for permission before delete

    if (this.created) {
      // Remove created workout
      await this.workoutService.createdWorkouts.remove(this.workout);
    } else {
      // Remove customized workout
      await this.workoutService.customizedWorkouts.remove(this.workout);
    }

    this.navCtrl.navigateBack('/home/my-library');
  }

  getWorkoutImageUI() {
    return this.workout.imageUrl ?? '/assets/img/workout/mix-workout.jpg';
  }
}
