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
    sets: number,
    reps: number,
    repType: string,
    exercises: string[]
  ) {
    const newProgress = new Progress(
      name,
      sets,
      reps,
      repType,
      exercises,
      0,
      0,
      true
    );

    return this.progresses.pipe(
      take(1),
      delay(1000),
      tap((progresses) => {
        this._progresses.next(progresses.concat(newProgress));
      })
    );
  }
}
