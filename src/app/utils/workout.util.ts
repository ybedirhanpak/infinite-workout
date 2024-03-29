import { Workout } from '@models/workout.model';

export const getEmptyWorkout = (id: number) => {
  return {
    id: id,
    name: "",
    duration: "",
    equipments: "",
    category: "",
    imageUrl: "",
    exercises: [],
  } as Workout;
};
