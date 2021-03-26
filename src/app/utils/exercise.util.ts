import { Exercise, SetDetail } from '@models/exercise.model';

const SET_DETAILS: { [type: string]: SetDetail } = {
  weightRep: {
    load: 'weight',
    rep: 'rep',
    loadUnit: 'kg',
    repUnit: 'reps',
  },
  weightTime: {
    load: 'weight',
    rep: 'time',
    loadUnit: 'kg',
    repUnit: 'sec',
  },
  distanceTime: {
    load: 'distance',
    rep: 'time',
    loadUnit: 'm',
    repUnit: 'sec',
  },
};

export const getSetDetail = (exercise: Exercise) => {
  return SET_DETAILS[exercise.set.type];
};

export const getDefaultSet = (exercise: Exercise) => {
  return {
    rep: 0,
    load: 0,
  };
};
