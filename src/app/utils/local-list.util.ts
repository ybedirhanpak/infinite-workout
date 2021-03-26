import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

// Models
import { IdHolder } from '@models/common.model';

// Utils
import { copyFrom } from '@utils/object.util';

export class LocalList<T extends Array<IdHolder>> {
  private list$: BehaviorSubject<T>;

  constructor(
    private storage: Storage,
    private storageKey: string,
    initialList: T = [] as T
  ) {
    this.list$ = new BehaviorSubject<T>(initialList);
  }

  get elements() {
    return this.list$.asObservable();
  }

  private async getList(): Promise<T> {
    const list = await this.storage.get(this.storageKey);
    if (!list || list?.length <= 0) {
      return [] as T;
    }
    return list;
  }

  async fetchFromStorage() {
    const list = await this.getList();
    this.list$.next(list);
  }

  async contains(element: IdHolder): Promise<boolean> {
    const list = await this.getList();
    const trainingRecord = list.find((e) => e.id === element.id);
    return !!trainingRecord;
  }

  async find(element: IdHolder): Promise<IdHolder> {
    const list = await this.getList();
    return list.find((e) => e.id === element.id);
  }

  async create(element: IdHolder, first?: boolean): Promise<void> {
    const list = await this.getList();

    const updatedList = (first
      ? [element].concat(list)
      : list.concat([element])) as T;
    await this.storage.set(this.storageKey, updatedList);
    this.list$.next(updatedList);
  }

  async update(element: IdHolder): Promise<void> {
    const list = await this.getList();
    const old = list.find((e) => e.id === element.id);
    copyFrom(element, old);
    await this.storage.set(this.storageKey, list);
    this.list$.next(list);
  }

  async remove(element: IdHolder): Promise<void> {
    const list = await this.getList();
    const updatedList = list.filter((e) => e.id !== element.id) as T;
    await this.storage.set(this.storageKey, updatedList);
    this.list$.next(updatedList);
  }

  public deleteAllElements() {
    this.storage.remove(this.storageKey);
    this.list$.next([] as T);
  }
}
