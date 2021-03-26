import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FormControl, FormGroup } from '@angular/forms';

// Model
import { Workout } from '@models/workout.model';
import { Exercise } from '@models/exercise.model';

// Service
import { ExerciseService } from '@services/exercise.service';
import { WorkoutService } from '@services/workout.service';

// Utils
import { copyFrom } from '@utils/object.util';

@Component({
  selector: 'app-create-edit-workout',
  templateUrl: './create-edit-workout.page.html',
  styleUrls: ['./create-edit-workout.page.scss'],
})
export class CreateEditWorkoutPage implements OnInit {
  mode: 'create' | 'edit' = 'create';
  workout: Workout;

  formGroup: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private exerciseService: ExerciseService,
    private workoutService: WorkoutService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    const paramMap = this.route.snapshot.paramMap;
    if (paramMap.has('id')) {
      // Edit Mode
      this.mode = 'edit';
      const id = parseInt(paramMap.get('id'));
      this.workoutService.createdWorkouts
        .find({ id })
        .then((workout: Workout) => {
          this.workout = workout;
          this.formGroup = new FormGroup({
            name: new FormControl(workout.name),
            duration: new FormControl(workout.duration),
            category: new FormControl(workout.category),
            equipments: new FormControl(workout.equipments),
          });
        })
        .catch((error) => {
          // TODO: Handle null workout
        });
    } else {
      // Create Mode
      this.mode = 'create';
      this.workout = new Workout(Date.now());
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

  onSaveClick() {
    this.workout = {
      ...this.workout,
      ...this.formGroup.value,
      imageUrl: '/assets/img/workout/mix-workout.jpg',
    };

    if (this.mode === 'create') {
      this.workoutService.createdWorkouts.create(this.workout);
    } else if (this.mode === 'edit') {
      this.workoutService.createdWorkouts.update(this.workout);
    }

    // TODO: Display toast message
    this.navCtrl.navigateBack('/home/my-library');
  }

  async onDeleteClick() {
    // TODO: Ask for permission before delete
    await this.workoutService.createdWorkouts.remove(this.workout);
    this.navCtrl.navigateBack('/home/my-library');
  }
}
