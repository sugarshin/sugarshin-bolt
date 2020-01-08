export const createPoll = (
  asyncFunc: (...a: any[]) => Promise<any>,
  comparator: (result: any) => boolean,
  interval: number = 1000 * 60
) => {
  return (...args: any[]) => {
    let timerId: NodeJS.Timeout;
    return new Promise((resolve, reject) => {
      const f = () => asyncFunc(...Array.from(args || []))
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
