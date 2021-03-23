export interface Exercise {
  id: number;
  name: string;
  imageUrl: string;
  type: string;
}

export interface ExerciseCategory {
  category: string;
  exercises: Exercise[];
}
