import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, of, from } from 'rxjs';
import { Progress } from '../models/progress.model';
import { take, tap, delay, switchMap, map } from 'rxjs/operators';
import { Exercise } from '../models/exercise.model';

const PROGRESS_KEY = 'PROGRESS';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private PROGRESS_LIST = new BehaviorSubject<Progress[]>([]);

  get progresses() {
    return this.PROGRESS_LIST.asObservable();
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
        this.PROGRESS_LIST.next(progresses);
      })
    );
  }

  addProgress(
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
          this.PROGRESS_LIST.next(updatedProgressList);
        });
      })
    );
  }

  deleteProgress(id: number) {
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
          this.PROGRESS_LIST.next(updatedProgressList);
        });
      })
    );
  }

  getProgress(id: number) {
    return from(this.storage.get(PROGRESS_KEY)).pipe(
      map((progresses) => {
        if (!progresses || progresses?.length <= 0) {
          return [];
        }
        return progresses;
      }),
      switchMap((progresses: Progress[]) => {
        const progress = progresses.filter((p: Progress) => p.id === id)[0];
        return of(progress);
      })
    );
  }

  updateProgress(
    id: number,
    name: string,
    sets: number,
    reps: number,
    repType: string,
    exercises: Exercise[]
  ) {
    return from(this.storage.get(PROGRESS_KEY)).pipe(
      map((progresses) => {
        if (!progresses || progresses?.length <= 0) {
          return [];
        }
        return progresses;
      }),
      map((progresses: Progress[]) => {
        const index = progresses.findIndex((p: Progress) => p.id === id);
        if (index < 0) {
          return;
        }
        const oldProgress = progresses[index];
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
        progresses[index] = updatedProgress;
        this.storage.set(PROGRESS_KEY, progresses).then(() => {
          this.PROGRESS_LIST.next(progresses);
        });
        return progresses;
      })
    );
  }

  reorderProgresses(reorderedList: Progress[]) {
    return from(this.storage.set(PROGRESS_KEY, reorderedList)).pipe(
      map((progresses) => {
        console.log('Progresses', progresses);
        this.PROGRESS_LIST.next(reorderedList);
      })
    );
  }
}
