import { StateHolder } from './common.model';
import { Exercise } from './exercise.model';

export interface Workout extends StateHolder {
  id: number;
  name: string;
  duration: string;
  equipments: string;
  category: string;
  imageUrl: string;
  exercises: Exercise[];
  state?: {
    favorited?: boolean;
    created?: boolean;
    customized?: boolean;
  };
}
