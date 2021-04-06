import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

export class LocalState<T> {
  private value$: BehaviorSubject<T>;

  constructor(
    private storage: Storage,
    private storageKey: string,
    private initialValue: T
  ) {
    this.value$ = new BehaviorSubject<T>(initialValue);
  }

  get value() {
    return this.value$.asObservable();
  }

  async fetch() {
    let value = await this.storage.get(this.storageKey);
    // If rest time is undefined or null, make it default value
    if (!value && value !== 0) {
      await this.storage.set(this.storageKey, this.initialValue);
      value = this.initialValue;
    }
    // If rest time is changed, update it
    this.value$.next(value);
  }

  async set(value: T) {
    await this.storage.set(this.storageKey, value);
    this.value$.next(value);
  }
}
