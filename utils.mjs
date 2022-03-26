export async function retry(fn, count = 3) {
  try {
    return await fn();
  } catch (e) {
    if (count === 1) {
      throw e;
    }

    console.log('Failure: ' + e.message);

    return await retry(fn, count - 1);
  }
}

export function range(from, to) {
  return Array.from({ length: to - from }, (_, i) => from + i);
}

export function chunk(array, size) {
  return Array.from({ length: Math.ceil(array.length / size) }, (v, i) =>
    array.slice(i * size, i * size + size),
  );
}

function toHumanTime(ms) {
  if (ms < 3000) {
    return ms.toFixed(1) + 'ms';
  }

  if (ms < 10000) {
    return (ms / 1e3).toFixed(2) + 's';
  }

  if (ms < 60000) {
    return (ms / 1e3).toFixed(1) + 's';
  }

  const left = ms % 60000;
  const minutes = (ms - left) / 60000;

  return minutes + 'm ' + toHumanTime(left);
}

export function measure(name = '') {
  const start = process.hrtime.bigint();

  return () => {
    const end = process.hrtime.bigint();
    const time = Number(end - start) / 1e6;

    console.log(`Task ${name} took: ${toHumanTime(time)}`);

    return time;
  };
}

export async function measureFn(name, callback) {
  const stop = measure(name);
  try {
    return await callback();
  } finally {
    stop();
  }
}
