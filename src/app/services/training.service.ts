import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Workout } from '@models/workout.model';
import { LocalState } from '@utils/local-state.util';
import { BehaviorSubject } from 'rxjs';
import { TrainingRecord } from '../models/training.model';

// Storage Keys
const TRAINING_RECORDS_KEY = 'TRAINING_RECORDS';
const REST_TIME_KEY = 'REST_TIME';

// Defaults
const REST_TIME_DEFAULT = 90;

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private TRAINING_RECORD_LIST = new BehaviorSubject<TrainingRecord[]>([]);

  public restTime: LocalState<number>;

  get trainingRecordList() {
    return this.TRAINING_RECORD_LIST.asObservable();
  }

  constructor(private storage: Storage) {
    this.restTime = new LocalState(storage, REST_TIME_KEY, REST_TIME_DEFAULT);
  }

  /**
   * Returns empty list if given trainingRecord list is null or empty
   * @param trainingRecordList is the lis to be adjusted
   */
  private adjustTrainingRecordList(trainingRecordList: TrainingRecord[]) {
    if (!trainingRecordList || trainingRecordList?.length <= 0) {
      return [];
    }
    return trainingRecordList;
  }

  /**
   * Fetchs trainingRecord list from storage and updates behavior subject
   */
  async fetchTrainingRecordList() {
    const trainingRecordList = this.adjustTrainingRecordList(
      await this.storage.get(TRAINING_RECORDS_KEY)
    );
    this.TRAINING_RECORD_LIST.next(trainingRecordList);
  }

  async saveTrainingRecord(workout: Workout, date: Date, duration: string) {
    const trainingRecordList = this.adjustTrainingRecordList(
      await this.storage.get(TRAINING_RECORDS_KEY)
    );
    const lastTrainingRecord =
      trainingRecordList.length > 0 ? trainingRecordList[0] : undefined;
    const id = lastTrainingRecord ? lastTrainingRecord.id + 1 : 0;

    const newTrainingRecord: TrainingRecord = {
      id,
      workout,
      date: date.toLocaleDateString(),
      duration,
    };

    const updatedList = [newTrainingRecord].concat(trainingRecordList);
    await this.storage.set(TRAINING_RECORDS_KEY, updatedList);
    this.TRAINING_RECORD_LIST.next(updatedList);
  }

  /**
   * Deletes trainingRecord from storage and behavior subject
   * @param id identifier of the trainingRecord to be deleted
   */
  async deleteTrainingRecord(id: number) {
    const trainingRecordList = this.adjustTrainingRecordList(
      await this.storage.get(TRAINING_RECORDS_KEY)
    );
    const updatedList = trainingRecordList.filter(
      (w: TrainingRecord) => w.id !== id
    );
    await this.storage.set(TRAINING_RECORDS_KEY, updatedList);
    this.TRAINING_RECORD_LIST.next(updatedList);
  }

  /**
   * Retrevies trainingRecord from trainingRecord list
   * @param id identifier of trainingRecord to be retreived
   */
  async getTrainingRecord(id: number) {
    const trainingRecordList = this.adjustTrainingRecordList(
      await this.storage.get(TRAINING_RECORDS_KEY)
    );
    const trainingRecord = trainingRecordList.filter(
      (w: TrainingRecord) => w.id === id
    )[0];
    return trainingRecord;
  }
}
