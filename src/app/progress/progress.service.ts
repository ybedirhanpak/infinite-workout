import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Progress } from './progress.model';

import { take, tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private _progresses = new BehaviorSubject<Progress[]>([]);

  get progresses() {
    return this._progresses.asObservable();
  }

  constructor() {}

  addProgress(
    name: string,
    exercises: string[],
    sets: number,
    reps: number,
    repType: 'sec' | 'reps',
    priority: number,
    enabled: boolean,
    currentExercise: number
  ) {
    const newProgress = new Progress(
      name,
      exercises,
      sets,
      reps,
      repType,
      priority,
      enabled,
      currentExercise
    );

    this.progresses.pipe(
      take(1),
      delay(1000),
      tap((progresses) => {
        this._progresses.next(progresses.concat(newProgress));
      })
    );
  }
}
