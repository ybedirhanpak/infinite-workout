export class Progress {
  constructor(
    public name: string,
    public sets: number,
    public reps: number,
    public repType: 'sec' | 'reps',
    public exercises: string[],
    public currentExercise: number,
    public priority: number,
    public enabled: boolean
  ) {}
}
