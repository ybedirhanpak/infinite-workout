import { Workout } from "./workout.model";

export interface TrainingRecord {
  id?: number;
  workout: Workout;
  duration: string;
  date: string;
}
