import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  AlertController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';

// Model
import { Workout } from '@models/workout.model';
import { Exercise } from '@models/exercise.model';

// Service
import { ExerciseService } from '@services/exercise.service';
import { WorkoutService } from '@services/workout.service';
import { ImageGalleryService } from '@services/image-gallery.service';

// Utils
import { copyFrom } from '@utils/object.util';
import { getEmptyWorkout } from '@utils/workout.util';
import { ImageGalleryPage } from '../image-gallery/image-gallery.page';

@Component({
  selector: 'app-create-edit-workout',
  templateUrl: './create-edit-workout.page.html',
  styleUrls: ['./create-edit-workout.page.scss'],
})
export class CreateEditWorkoutPage implements OnInit {
  // Workout information
  workout: Workout;
  exercises: Exercise[];
  created = false;
  customized = false;

  mode: 'create' | 'edit' = 'create';
  // Create & Edit
  formGroup: UntypedFormGroup;
  reorder = false;
  changed = false;

  defaultImage = '/assets/img/workout/workout-1.jpg';

  constructor(
    private router: Router,
    private exerciseService: ExerciseService,
    private workoutService: WorkoutService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    imageGalleryService: ImageGalleryService,
    private alertController: AlertController
  ) {
    this.defaultImage = imageGalleryService.getRandomImage();
  }

  ngOnInit() {
    const editMode = this.router.url.includes('edit-workout');
    if (editMode) {
      // Edit Mode
      this.mode = 'edit';
      this.workoutService.workoutEdit.get().subscribe(async (workout) => {
        this.workout = { ...workout };
        this.exercises = this.workout.exercises;

        this.created = this.workout.state?.created;
        this.customized = this.workout.state?.customized;

        if (!this.customized && !this.created) {
          this.workout.name = `${this.workout.name} (Copy)`;
        }

        this.formGroup = new UntypedFormGroup({
          name: new UntypedFormControl(this.workout.name),
          duration: new UntypedFormControl(this.workout.duration),
          category: new UntypedFormControl(this.workout.category),
          equipments: new UntypedFormControl(this.workout.equipments),
        });
      });
    } else {
      // Create Mode
      this.mode = 'create';
      this.workout = getEmptyWorkout(Date.now());
      this.exercises = [];
      this.formGroup = new UntypedFormGroup({
        name: new UntypedFormControl(''),
        duration: new UntypedFormControl(''),
        category: new UntypedFormControl(''),
        equipments: new UntypedFormControl(''),
      });
    }

    if (this.formGroup) {
      this.formGroup.valueChanges.subscribe(() => {
        this.changed = true;
      });
    }
  }

  getTitle() {
    return this.mode === 'create' ? 'Create Workout' : 'Edit Workout';
  }

  ionViewWillEnter() {
    if (this.workout) {
      this.exerciseService.editedExercise.get().subscribe((exercise) => {
        if (exercise) {
          const oldExercise = this.exercises.find((e) => e.id === exercise.id);
          if (oldExercise) {
            copyFrom(exercise, oldExercise);
          } else {
            this.exercises.push(exercise);
          }
          this.changed = true;
        }
      });
    }
  }

  onAddExerciseClick() {
    const navigateUrl = `${this.router.url}/exercises`;
    this.router.navigateByUrl(navigateUrl);
  }

  async saveWorkout() {
    const workoutToSave = {
      imageUrl: this.defaultImage,
      ...this.workout,
      ...this.formGroup.value,
      exercises: this.exercises,
    };

    if (this.mode === 'create') {
      this.workoutService.createWorkout(workoutToSave).then(() => {
        this.navCtrl.navigateBack('/home/my-library');
      });
    } else if (this.mode === 'edit') {
      if (this.customized || this.created) {
        this.workoutService.editWorkout(workoutToSave);
      } else {
        this.workoutService.customizeWorkout(workoutToSave);
      }

      this.workoutService.workoutDetail.set(workoutToSave);
      this.navCtrl.navigateBack('/workout-detail');
    }

    // Clear edited exercise
    this.exerciseService.editedExercise.set(null);
  }

  async onReorderClick() {
    this.reorder = !this.reorder;
  }

  async onDeleteClick() {
    const deleteWorkout = async () => {
      await this.workoutService.deleteWorkout(this.workout);
      this.navCtrl.navigateBack('/home/my-library');
    };

    // Ask for permission before delete
    this.alertController
      .create({
        header: 'Delete this workout?',
        message:
          'All workout information and exercise details will be deleted.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            handler: deleteWorkout,
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  async onReorderExercise(event) {
    const itemMove = this.exercises.splice(event.detail.from, 1)[0];
    this.exercises.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
    this.changed = true;
  }

  onEditExerciseClick(exercise: Exercise) {
    this.exerciseService.exerciseDetail.set(exercise);
    const navigateUrl = `${this.router.url}/exercise-edit`;
    this.router.navigateByUrl(navigateUrl);
  }

  onDeleteExerciseClick(exercise: Exercise) {
    const deleteExercise = () => {
      const index = this.exercises.findIndex((e) => e.id === exercise.id);
      this.exercises.splice(index, 1);
      this.changed = true;
    };

    // Ask for permission before delete
    this.alertController
      .create({
        header: 'Remove this exercise?',
        message: 'All information regarding this exercise will be deleted.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            handler: deleteExercise,
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  async selectImage() {
    if (this.mode === 'edit' && !this.workout.state?.created) {
      return;
    }

    const modal = await this.modalCtrl.create({
      component: ImageGalleryPage,
      componentProps: {
        isModal: true,
      },
    });

    modal.onDidDismiss().then((event) => {
      if (event.data.image) {
        this.workout.imageUrl = event.data.image;
        this.changed = true;
      }
    });

    return await modal.present();
  }

  onBackButtonClick() {
    if (this.changed) {
      this.alertController
        .create({
          header: 'Do you want to leave?',
          message:
            "You have changed this workout. If you don't save, all changes will be lost forever.",
          buttons: [
            {
              text: 'Save',
              handler: () => this.saveWorkout(),
            },
            {
              text: 'Exit without saving',
              handler: () => this.navCtrl.back(),
            },
            {
              text: 'Cancel',
              role: 'cancel',
            },
          ],
        })
        .then((alert) => {
          alert.present();
        });
    } else {
      this.navCtrl.back();
    }
  }

  getReorderTextUI() {
    return this.reorder ? 'Done' : 'Reorder';
  }

  getWorkoutImageUI() {
    return this.workout.imageUrl ?? this.defaultImage;
  }
}
