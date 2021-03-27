import { Exercise } from './exercise.model';

export interface Workout {
  id: number;
  name: string;
  duration: string;
  equipments: string;
  category: string;
  imageUrl: string;
  exercises: Exercise[];
}
