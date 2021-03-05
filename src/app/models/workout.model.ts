enum Equipment {
  bodyWeight = "Body Weight",
  barbell = "Barbell",
  dumbbell = "Dumbbell",
  kettlebell = "Kettlebell",
}

interface Exercise {
  id: number;
  name: string;
  duration: string;
  repetition?: string;
  weight?: string;
  imageUrl?: string;
  videoUrl?: string; // Youtube video embed link
}

export interface Workout {
  id: number;
  name: string;
  duration: string;
  equipments: Equipment[];
  description?: string;
  category?: string;
  imageUrl?: string;
  exercises: Exercise[];
}
