import { Exercise } from '../exercise.model';

export interface ProgressData {
  id: number;
  name: string;
  sets: number;
  reps: number;
  repType: string;
  exercises: Exercise[];
  currentExercise: Exercise;
  enabled: boolean;
}

export class Progress {
  constructor(
    public id: number,
    public name: string,
    public sets: number,
    public reps: number,
    public repType: string,
    public exercises: Exercise[],
    public currentExercise: Exercise,
    public enabled: boolean,
    public cloudKey: string = null
  ) {}

  public static extractData(key: string, data: ProgressData): Progress {
    return new Progress(
      data.id,
      data.name,
      data.sets,
      data.reps,
      data.repType,
      data.exercises,
      data.currentExercise,
      data.enabled,
      key
    );
  }
}
