import { Exercise } from './exercise.model';

export class Progress {
  constructor(
    public id: number,
    public name: string,
    public sets: number,
    public reps: number,
    public repType: string,
    public exercises: Exercise[],
    public currentExercise: Exercise,
    public enabled: boolean
  ) {}
}
