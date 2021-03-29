export const copyFrom = (from: any, to: any) => {
  Object.keys(from).forEach((key) => {
    to[key] = from[key];
  });
  return to;
};

export const groupBy = (list: any[], name: string, group: string) => {
  const grouped = {};
  list.map((element) => {
    if (grouped[element[group]]) {
      grouped[element[group]][name].push(element);
    } else {
      grouped[element[group]] = {
        [group]: element[group],
        [name]: [element],
      };
    }
  });
  return Object.values(grouped);
};
