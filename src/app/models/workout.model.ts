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

export interface SetRep {
  type: 'setRep';
  opts: {
    sets: [
      {
        rep: number;
        weight: number;
        unit: 'kg' | 'lb';
      }
    ];
  };
}

export interface Time {
  type: 'time';
  opts: {
    time: number;
    unit: 'min' | 'sec';
  };
}

export interface SetTime {
  type: 'setTime';
  opts: {
    sets: [
      {
        time: number;
        unit: 'min' | 'sec';
      }
    ];
  };
}

interface WorkoutExercise {
  id: number;
  name: string;
  duration: string;
  imageUrl?: string;
  videoUrl?: string; // Youtube video embed link
  load: Weight | Distance | BodyWeight;
  rep: SetRep | Time | SetTime;
}

export const getLoadString = (exercise: WorkoutExercise) => {
  let load = '';

  switch (exercise.load.type) {
    case 'weight':
      load = `${exercise.load.opts.weight} ${exercise.load.opts.unit}`;
      break;
    case 'distance':
      load = `${exercise.load.opts.distance} ${exercise.load.opts.unit}`;
      break;
    case 'bodyWeight':
      load = 'Body weight';
      break;
    default:
      break;
  }

  return load;
};

export const getRepString = (exercise: WorkoutExercise) => {
  let rep = '';

  switch (exercise.rep.type) {
    case 'setRep':
      rep = `${exercise.rep.opts.sets.length} sets ${exercise.rep.opts.sets[0].rep} reps`;
      break;
    case 'time':
      rep = `${exercise.rep.opts.time} ${exercise.rep.opts.unit}`;
      break;
    case 'setTime':
      rep = `${exercise.rep.opts.sets.length} sets ${exercise.rep.opts.sets[0].time} ${exercise.rep.opts.sets[0].unit}`;
      break;
    default:
      break;
  }

  return rep;
};

export class Workout {
  id: number;
  name: string;
  duration?: Time;
  equipments: Equipment[];
  description?: string;
  category?: string;
  imageUrl?: string;
  exercises: WorkoutExercise[];

  getDurationString = () => {
    return `${this.duration?.opts.time} ${this.duration?.opts.unit}`;
  }
}
