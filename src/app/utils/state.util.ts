import { BehaviorSubject, Observable } from 'rxjs';

export class State<T> {
  private subject: BehaviorSubject<T>;

  constructor(initialValue: T) {
    this.subject = new BehaviorSubject<T>(initialValue);
  }

  public get(): Observable<T> {
    return this.subject.asObservable();
  }

  public set(element: T) {
    this.subject.next(element);
  }
}
