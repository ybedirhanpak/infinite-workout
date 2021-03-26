export const copyFrom = (from: any, to: any) => {
  Object.keys(from).forEach((key) => {
    to[key] = from[key];
  });
  return to;
};
