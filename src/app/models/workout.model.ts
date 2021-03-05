enum Equipment {
  bodyWeight,
  barbell,
  dumbbell,
  kettlebell,
}

interface Exercise {
  id: number;
  name: string;
  duration: number; // Milliseconds
  image_url?: string;
  embed_url?: string; // Youtube video embed link
}

export interface Workout {
  id: number;
  name: string;
  duration: number; // Milliseconds
  equipments: Equipment[];
  description?: string;
  category?: string;
  exercises: Exercise[];
}
