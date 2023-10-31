import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { map } from 'rxjs/operators';

// Model
import { TrainingRecord } from '@models/training.model';

// Utils
import { LocalList } from '@utils/local-list.util';
import { LocalState } from '@utils/local-state.util';

// Storage Keys
const TRAINING_RECORDS_KEY = 'TRAINING_RECORDS';
const REST_TIME_KEY = 'REST_TIME';

// Defaults
const REST_TIME_DEFAULT = 90;

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  public restTime: LocalState<number>;
  public trainingRecordList: LocalList<TrainingRecord>;

  constructor(storage: Storage) {
    this.restTime = new LocalState(storage, REST_TIME_KEY, REST_TIME_DEFAULT);
    this.trainingRecordList = new LocalList(storage, TRAINING_RECORDS_KEY, [] as TrainingRecord[]);
  }

  get trainingRecordList$() {
    return this.trainingRecordList.elements.pipe(
      map((trainingRecords) => {
        return trainingRecords.sort((t1, t2) => t2.id - t1.id);
      })
    );
  }
}
