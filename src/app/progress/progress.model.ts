export class Progress {
  constructor(
    public name: string,
    public exercises: string[],
    public sets: number,
    public reps: number,
    public repType: 'sec' | 'reps',
    public priority: number,
    public enabled: boolean,
    public currentExercise: number
  ) {}
}
