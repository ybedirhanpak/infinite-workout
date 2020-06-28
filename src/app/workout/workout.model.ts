export class Workout {
  constructor(
    public id: number,
    public exercises: string[],
    public date: Date,
    public totalTime: string
  ) {}
}
