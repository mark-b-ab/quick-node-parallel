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