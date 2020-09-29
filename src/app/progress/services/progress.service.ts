import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { Progress } from '../models/progress.model';
import { Exercise } from '../models/exercise.model';

const PROGRESS_KEY = 'PROGRESS';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private PROGRESS_LIST = new BehaviorSubject<Progress[]>([]);

  get progressList() {
    return this.PROGRESS_LIST.asObservable();
  }

  constructor(private storage: Storage) {}

  /**
   * Returns empty list if given progress list is null or empty
   * @param progressList is the lis to be adjusted
   */
  adjustProgressList(progressList: Progress[]) {
    if (!progressList || progressList?.length <= 0) {
      return [];
    }
    return progressList;
  }

  /**
   * Fetchs progress list from storage and updates behavior subject
   */
  async fetchProgressList() {
    const progressList = this.adjustProgressList(
      await this.storage.get(PROGRESS_KEY)
    );
    this.PROGRESS_LIST.next(progressList);
  }

  /**
   * Creates and saves progress
   * @param name name of the progress
   * @param sets number of sets
   * @param reps number of reps
   * @param repType type of rep, either 'reps' or 'sec'
   * @param exercises list of exercises
   */
  async saveProgress(
    name: string,
    sets: number,
    reps: number,
    repType: string,
    exercises: Exercise[]
  ) {
    const newProgress = new Progress(
      Date.now(),
      name,
      sets,
      reps,
      repType,
      exercises,
      exercises.find((e) => e.selected),
      true
    );
    const progressList = this.adjustProgressList(
      await this.storage.get(PROGRESS_KEY)
    );
    const updatedList = progressList.concat(newProgress);
    await this.storage.set(PROGRESS_KEY, updatedList);
    this.PROGRESS_LIST.next(updatedList);
  }

  /**
   * Deletes progress from storage and behavior subject
   * @param id identifier of the progress to be deleted
   */
  async deleteProgress(id: number) {
    const progressList = this.adjustProgressList(
      await this.storage.get(PROGRESS_KEY)
    );
    const updatedList = progressList.filter((p: Progress) => p.id !== id);
    await this.storage.set(PROGRESS_KEY, updatedList);
    this.PROGRESS_LIST.next(updatedList);
  }

  /**
   * Retrevies progress from progress list
   * @param id identifier of progress to be retreived
   */
  async getProgress(id: number) {
    const progressList = this.adjustProgressList(
      await this.storage.get(PROGRESS_KEY)
    );
    const progress = progressList.filter((p: Progress) => p.id === id)[0];
    if (!progress) {
      throw Error('Invalid progress ID');
    }
    return progress;
  }

  /**
   * Updates values of a progress
   * @param id identifier of progress to be updated
   * @param name name of the progress
   * @param sets number of sets
   * @param reps number of reps
   * @param repType type of rep, either 'reps' or 'sec'
   * @param exercises list of exercises
   */
  async updateProgress(
    id: number,
    name: string,
    sets: number,
    reps: number,
    repType: string,
    exercises: Exercise[]
  ) {
    const progressList = this.adjustProgressList(
      await this.storage.get(PROGRESS_KEY)
    );

    const index = progressList.findIndex((p: Progress) => p.id === id);

    if (index < 0) {
      throw Error('Invalid progress ID');
    }

    const oldProgress = progressList[index];
    const updatedProgress = new Progress(
      oldProgress.id,
      name,
      sets,
      reps,
      repType,
      exercises,
      exercises.find((e) => e.selected),
      oldProgress.enabled
    );
    progressList[index] = updatedProgress;

    await this.storage.set(PROGRESS_KEY, progressList);
    this.PROGRESS_LIST.next(progressList);
  }

  /**
   * Updates progress list with reordered version
   * @param reorderedList new version of list which is reordered
   */
  async reorderProgresses(reorderedList: Progress[]) {
    await this.storage.set(PROGRESS_KEY, reorderedList);
    this.PROGRESS_LIST.next(reorderedList);
  }
}
