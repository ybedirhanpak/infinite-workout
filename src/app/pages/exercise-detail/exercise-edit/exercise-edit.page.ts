import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

// Model
import { Exercise } from '@models/exercise.model';
import { SetRep, WorkoutExercise } from '@models/workout.model';
import { ExerciseService } from '@services/exercise.service';

@Component({
  selector: 'app-exercise-edit',
  templateUrl: './exercise-edit.page.html',
  styleUrls: ['./exercise-edit.page.scss'],
})
export class ExerciseEditPage implements OnInit {
  exercise: Exercise;

  defaultRep = 10;
  suggestedWeight: number;

  sets = [
    {
      rep: this.defaultRep,
      weight: undefined,
      unit: 'kg',
    },
    {
      rep: this.defaultRep,
      weight: undefined,
      unit: 'kg',
    },
    {
      rep: this.defaultRep,
      weight: undefined,
      unit: 'kg',
    },
  ];

  constructor(private exerciseService: ExerciseService, private navCtrl: NavController, private router: Router) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.exerciseService.exerciseDetail.subscribe((exercise) => {
      this.exercise = exercise;
    });
  }

  onAddClick() {
    const lastElement =
      this.sets.length > 0 ? this.sets[this.sets.length - 1] : undefined;

    this.sets.push({
      rep: lastElement?.rep ?? this.defaultRep,
      weight: lastElement?.weight,
      unit: 'kg',
    });
  }

  onDeleteClick(i: number) {
    this.sets.splice(i, 1);
  }

  onSaveClick() {
    console.log(this.sets);

    const workoutExercise: WorkoutExercise = {
      ...this.exercise,
      duration: '',
      load: {
        type: 'weight',
        opts: {
          weight: this.sets[0].weight,
          unit: "kg"
        }
      },
      rep: {
        type: 'setRep',
        opts: {
          sets: this.sets as any
        }
      }
    }

    console.log(workoutExercise);
    this.exerciseService.setEditedExercise(workoutExercise);

    this.navCtrl.navigateBack("/home/my-library/create-workout");
  }

  onWeightBlur(event: any) {
    const weight = event.target.value;
    if (this.suggestedWeight === undefined && weight !== undefined) {
      this.suggestedWeight = weight;

      this.sets.forEach((set) => {
        if (set.weight === undefined) {
          set.weight = weight;
        }
      });
    }
  }
}
