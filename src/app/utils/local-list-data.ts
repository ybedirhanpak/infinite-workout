import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { IdHolder } from '@models/common.model';

export class LocalListData<T extends Array<IdHolder>> {
  private dataSubject: BehaviorSubject<T>;

  constructor(
    private storage: Storage,
    private storageKey: string,
    initialData: T = [] as T
  ) {
    this.dataSubject = new BehaviorSubject<T>(initialData);
  }

  get data() {
    return this.dataSubject.asObservable();
  }

  private dataOrEmptyList(data: T): T {
    if (!data || data?.length <= 0) {
      return [] as T;
    }
    return data;
  }

  async fetchData() {
    const data = this.dataOrEmptyList(await this.storage.get(this.storageKey));
    this.dataSubject.next(data);
  }

  async addToList(element: IdHolder, first?: boolean): Promise<void> {
    const data = this.dataOrEmptyList(await this.storage.get(this.storageKey));

    const updatedList = (first
      ? [element].concat(data)
      : data.concat([element])) as T;
    await this.storage.set(this.storageKey, updatedList);
    this.dataSubject.next(updatedList);
  }

  async deleteFromList(element: IdHolder): Promise<void> {
    const data = this.dataOrEmptyList(await this.storage.get(this.storageKey));

    const updatedList = data.filter((e) => e.id !== element.id) as T;
    await this.storage.set(this.storageKey, updatedList);
    this.dataSubject.next(updatedList);
  }

  async contains(element: IdHolder): Promise<boolean> {
    const data = this.dataOrEmptyList(await this.storage.get(this.storageKey));

    const trainingRecord = data.filter((e) => e.id === element.id)[0];

    return !!trainingRecord;
  }
}
