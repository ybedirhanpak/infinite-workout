export const copyFrom = (from: any, to: any) => {
  Object.keys(from).forEach((key) => {
    to[key] = from[key];
  });
  return to;
};

type Grouped<T> = {
  [key: string]: T[];
};

export const groupBy = <T extends Record<string, any>>(
  list: T[],
  name: string,
  group: string
): Grouped<T>[] => {
  const grouped: Record<string, Grouped<T>> = {};

  list.forEach((element) => {
    const groupName = String(element[group]);
    if (!grouped[groupName]) {
      grouped[groupName] = { [name]: [] };
    }

    grouped[groupName][name].push(element);
  });

  return Object.values(grouped);
};
