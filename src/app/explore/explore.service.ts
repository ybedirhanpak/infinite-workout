import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, of } from 'rxjs';
import { Progress, ProgressData } from '../progress/models/progress.model';
import { Exercise } from '../progress/exercise.model';
import { switchMap, take, tap, map } from 'rxjs/operators';
import { ProgressService } from '../progress/progress.service';

const BASE_URL = 'https://infinite-workout.firebaseio.com';

@Injectable({
  providedIn: 'root',
})
export class ExploreService {
  private _progressList = new BehaviorSubject<Progress[]>([]);

  get progressList() {
    return this._progressList.asObservable();
  }

  constructor(
    private http: HttpClient,
    private progressService: ProgressService
  ) {}

  fetchBookings() {
    return this.http.get<ProgressData>(`${BASE_URL}/progressList.json`).pipe(
      switchMap((resData) => {
        const progressList = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            const progress: Progress = Progress.extractData(key, resData[key]);
            progressList.push(progress);
          }
        }
        return of(progressList);
      }),
      tap((progressList) => {
        this._progressList.next(progressList);
      })
    );
  }

  uploadProgress(
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

    let generatedId: string;
    return this.http
      .post<{ name: string }>(`${BASE_URL}/progressList.json`, newProgress)
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.progressList;
        }),
        take(1),
        tap((progressList) => {
          this._progressList.next(progressList.concat(newProgress));
        })
      );
  }

  downloadProgress(id: number) {
    return this.progressList.pipe(
      take(1),
      map((progressList: Progress[]) => {
        return progressList.find((p) => p.id === id);
      }),
      switchMap((progress: Progress) => {
        if (progress) {
          const { name, sets, reps, repType, exercises } = progress;
          return this.progressService.addProgress(
            name,
            sets,
            reps,
            repType,
            exercises
          );
        }
      })
    );
  }

  getProgress(id: number) {
    return this.progressList.pipe(
      take(1),
      map((progressList: Progress[]) => {
        return progressList.find((p) => p.id === id);
      })
    );
  }
}
