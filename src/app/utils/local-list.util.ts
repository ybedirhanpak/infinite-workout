import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

// Models
import { StateHolder } from '@models/common.model';

// Utils
import { copyFrom } from '@utils/object.util';

export class LocalList<T extends StateHolder> {
  private list$: BehaviorSubject<T[]>;

  constructor(
    private storage: Storage,
    private storageKey: string,
    initialList = [] as T[]
  ) {
    this.list$ = new BehaviorSubject<T[]>(initialList);
  }

  get elements() {
    return this.list$.asObservable();
  }

  private async getList(): Promise<T[]> {
    const list = await this.storage.get(this.storageKey);
    if (!list || list?.length <= 0) {
      return [] as T[];
    }
    return list;
  }

  /**
   * Loads local states of elements
   */
  async loadLocalState(element: T) {
    const local = await this.find(element);
    if (local && local.state) {
      element.state = local.state;
    } else {
      element.state = undefined;
    }
    return element;
  }

  /**
   * Loads local states of elements in the list.
   */
  async loadLocalStates(list: T[]) {
    const promises = list.map(async (element: T) => {
      return this.loadLocalState(element);
    });

    return Promise.all(promises).then((workouts) => {
      return [...workouts] as T[];
    });
  }

  async fetchFromStorage() {
    const list = await this.getList();
    this.list$.next(list);
    return list;
  }

  async contains(element: T): Promise<boolean> {
    const list = await this.getList();
    const trainingRecord = list.find((e) => e.id === element.id);
    return !!trainingRecord;
  }

  async find(element: T): Promise<T | undefined> {
    const list = await this.getList();
    return list.find((e) => e.id === element.id);
  }

  async create(element: T, first?: boolean): Promise<T> {
    const list = await this.getList();

    const updatedList = (first
      ? [element].concat(list)
      : list.concat([element])) as T[];
    await this.storage.set(this.storageKey, updatedList);
    this.list$.next(updatedList);
    return element;
  }

  async update(element: StateHolder): Promise<StateHolder> {
    const list = await this.getList();
    const old = list.find((e) => e.id === element.id);
    copyFrom(element, old);
    await this.storage.set(this.storageKey, list);
    this.list$.next(list);
    return element;
  }

  async remove(element: StateHolder): Promise<boolean> {
    const list = await this.getList();
    const updatedList = list.filter((e) => e.id !== element.id);
    await this.storage.set(this.storageKey, updatedList);
    this.list$.next(updatedList);
    return true;
  }

  public deleteAllElements() {
    this.storage.remove(this.storageKey);
    this.list$.next([] as T[]);
  }
}
