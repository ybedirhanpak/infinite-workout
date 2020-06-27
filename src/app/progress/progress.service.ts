import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, of, from } from 'rxjs';
import { Progress } from './progress.model';
import { take, tap, delay, switchMap, map } from 'rxjs/operators';

const PROGRESS_KEY = 'PROGRESS';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private _progresses = new BehaviorSubject<Progress[]>([]);

  get progresses() {
    return this._progresses.asObservable();
  }

  constructor(private storage: Storage) {}

  fetchProgresses() {
    return from(this.storage.get(PROGRESS_KEY)).pipe(
      map((progresses) => {
        if (!progresses || progresses?.length <= 0) {
          return [];
        }
        return progresses;
      }),
      tap((progresses) => {
        this._progresses.next(progresses);
      })
    );
  }

  addProgress(
    name: string,
    sets: number,
    reps: number,
    repType: string,
    exercises: string[]
  ) {
    const newProgress = new Progress(
      Date.now(),
      name,
      sets,
      reps,
      repType,
      exercises,
      0,
      0,
      true
    );

    return from(this.storage.get(PROGRESS_KEY)).pipe(
      map((progresses) => {
        if (!progresses || progresses?.length <= 0) {
          return [];
        }
        return progresses;
      }),
      tap((progresses: Progress[]) => {
        const updatedProgressList = progresses.concat(newProgress);
        this.storage.set(PROGRESS_KEY, updatedProgressList).then(() => {
          this._progresses.next(updatedProgressList);
        });
      })
    );
  }

  deleteProgress(id: number) {
    let updatedProgressList: Progress[] = [];
    return from(this.storage.get(PROGRESS_KEY)).pipe(
      map((progresses) => {
        if (!progresses || progresses?.length <= 0) {
          return [];
        }
        return progresses;
      }),
      tap((progresses: Progress[]) => {
        const updatedProgressList = progresses.filter(
          (p: Progress) => p.id !== id
        );
        this.storage.set(PROGRESS_KEY, updatedProgressList).then(() => {
          this._progresses.next(updatedProgressList);
        });
      })
    );
  }

  deleteProgress2(id: number) {
    let updatedProgressList: Progress[] = [];
    return from(this.storage.get(PROGRESS_KEY)).pipe(
      switchMap((progresses: Progress[]) => {
        if (!progresses || progresses?.length <= 0) {
          return [];
        }
        const index = progresses.findIndex((p: Progress) => p.id === id);
        if (index < 0) {
          updatedProgressList = progresses;
          return progresses;
        }
        updatedProgressList = progresses.slice(index, 1);
        return from(this.storage.set(PROGRESS_KEY, updatedProgressList));
      }),
      switchMap(() => {
        return this.progresses;
      }),
      tap((progresses: Progress[]) => {
        this._progresses.next(progresses);
      })
    );
  }
}
