enum Equipment {
  bodyWeight = 'Body Weight',
  barbell = 'Barbell',
  dumbbell = 'Dumbbell',
  kettlebell = 'Kettlebell',
}

interface Weight {
  type: 'weight';
  opts: {
    weight: number;
    unit: 'kg' | 'lb';
  };
}

interface Distance {
  type: 'distance';
  opts: {
    distance: number;
    unit: 'km' | 'miles';
  };
}

interface BodyWeight {
  type: 'bodyWeight';
  opts?: {
    weight: number;
    unit: 'kg' | 'lb';
  };
}

interface SetRep {
  type: 'setRep';
  opts: {
    set: number;
    rep: number;
  };
}

export interface Time {
  type: 'time';
  opts: {
    time: number;
    unit: 'min' | 'sec';
  };
}

interface SetTime {
  type: 'setTime';
  opts: {
    set: number;
    time: number;
    unit: 'min' | 'sec';
  };
}

interface Exercise {
  id: number;
  name: string;
  duration: string;
  imageUrl?: string;
  videoUrl?: string; // Youtube video embed link
  load: Weight | Distance | BodyWeight;
  rep: SetRep | Time | SetTime;
}

const a: Exercise = {
  id: 1,
  name: 'Exercise',
  duration: '10 min',
  load: {
    type: 'weight',
    opts: {
      weight: 10,
      unit: 'kg',
    },
  },
  rep: {
    type: 'setRep',
    opts: {
      set: 3,
      rep: 12,
    },
  },
};

export interface Workout {
  id: number;
  name: string;
  duration: Time;
  equipments: Equipment[];
  description?: string;
  category?: string;
  imageUrl?: string;
  exercises: Exercise[];
}
