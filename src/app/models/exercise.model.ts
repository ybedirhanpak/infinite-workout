export interface SetDetail {
  load: string;
  rep: string;
  loadUnit: string;
  repUnit: string;
}

export interface Set {
  load: number;
  rep: number;
}

interface WeightRep {
  type: 'weightRep';
  sets: Set[];
}

interface WeightTime {
  type: 'weightTime';
  sets: Set[];
}

interface DistanceTime {
  type: 'distanceTime';
  sets: Set[];
}

export interface Exercise {
  id: number,
  name: string,
  imageUrl: string,
  category: string,
  equipment: string,
  handType: 'single-hand' | 'two-hand',
  set: WeightRep | WeightTime | DistanceTime
}

export interface ExerciseCategory {
  category: string;
  exercises: Exercise[];
}