export class Progress {
  constructor(
    public id: number,
    public name: string,
    public sets: number,
    public reps: number,
    public repType: string,
    public exercises: string[],
    public currentExercise: number,
    public priority: number,
    public enabled: boolean
  ) {}
}
