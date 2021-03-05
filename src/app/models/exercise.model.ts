export class Exercise {
  constructor(public name: string, public selected: boolean) {}

  public static extractString(name: string): Exercise {
    return new Exercise(name, false);
  }

  public static extractStringArray(names: string[], selectedIndex: number) {
    return names.map((name, index) => {
      const selected = index === selectedIndex;
      return new Exercise(name, selected);
    });
  }
}
