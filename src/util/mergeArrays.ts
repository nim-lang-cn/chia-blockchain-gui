import mergeArrayItem from './mergeArrayItem';

export default function mergeArrays<T>(
  base: T[] = [],
  identity: (a: T) => any,
  name: (a: T) => any,
  ...sources: T[][]
): T[] | undefined {
  let result = [...base];

  sources.forEach((sourceArray) => {
    sourceArray.forEach((item) => {
      const id = identity(item);
      const n = name(item);
      const index = result.findIndex(
        (resultItem) => identity(resultItem) === id,
      );
      if (index === -1) {
        result.push(item);
      } else {
        result = mergeArrayItem<T>(
          result,
          (resultItem) => identity(resultItem) === id,
          (resultItem) => name(resultItem) === n,
          item,
        );
      }
    });
  });

  return result;
}
