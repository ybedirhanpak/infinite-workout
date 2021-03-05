import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

// Model
import { Progress, ProgressData } from '@models/progress.model';

// Service
import { ProgressService } from '@services/progress.service';

const BASE_URL = 'https://infinite-workout.firebaseio.com';

@Injectable({
  providedIn: 'root',
})
export class ExploreService {
  private PROGRESS_LIST = new BehaviorSubject<Progress[]>([]);

  get progressList() {
    return this.PROGRESS_LIST.asObservable();
  }

  constructor(
    private http: HttpClient,
    private progressService: ProgressService
  ) {}

  /**
   * Fetch list of progress from server and update behavior subject
   */
  async fetchProgressList(): Promise<void> {
    const response = await this.http.get<ProgressData>(`${BASE_URL}/progressList.json`).toPromise();
    const progressList = [];
    for (const key in response) {
      if (response.hasOwnProperty(key)) {
        const progress: Progress = Progress.extractData(key, response[key]);
        progressList.push(progress);
      }
    }
    this.PROGRESS_LIST.next(progressList);
  }

  /**
   * Downloads progress to device storage
   * @param id identifier of progress to be downloaded
   */
  async downloadProgress(id: number): Promise<void> {
    const progress = this.PROGRESS_LIST.value.find((p) => p.id === id);
    if (!progress) {
      throw Error('Invalid progress ID');
    }
    const { name, sets, reps, repType, exercises } = progress;
    return this.progressService.saveProgress(
      name,
      sets,
      reps,
      repType,
      exercises
    );
  }

  /**
   * Retreives a progress from progress list
   * @param id identifier of the progress to be retreived
   */
  async getProgress(id: number): Promise<Progress> {
    const progress = this.PROGRESS_LIST.value.find((p) => p.id === id);
    if (!progress) {
      throw Error('Invalid progress ID');
    }
    return progress;
  }
}
