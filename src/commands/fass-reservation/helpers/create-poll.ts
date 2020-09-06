/* eslint-disable @typescript-eslint/no-explicit-any */
type AsyncFunction = (...args: any[]) => Promise<unknown>;
type ComparatorFunction = (result: any) => boolean;
/* eslint-enable @typescript-eslint/no-explicit-any */

export const createPoll = <T extends AsyncFunction, U extends ComparatorFunction>(
  asyncFunc: T,
  comparator: U,
  interval: number = 1000 * 60,
) => {
  return (...args: Parameters<T>): Promise<unknown> => {
    let timerId: NodeJS.Timeout;
    return new Promise((resolve, reject) => {
      const f = () =>
        asyncFunc(...Array.from(args || []))
          .then(result => {
            if (comparator(result)) {
              clearTimeout(timerId);
              resolve(result);
            } else {
              timerId = setTimeout(f, interval);
            }
          })
          .catch(err => {
            clearTimeout(timerId);
            reject(err);
          });

      f();
    });
  };
};
