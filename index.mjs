import { chunk, measureFn, range } from './utils.mjs';
import { getBlock }                from './block.mjs';
import { makeWeb3 }                from './web3.mjs';

if (!process.argv[2]) {
  console.log('Usage: node index.mjs <node-url> [<parallelism>]');
  process.exit(1);
}

const web3 = makeWeb3(process.argv[2]);

const blocksToQuery = chunk(range(100_000, 110_000), +process.argv[3] || 10);

for (const blocks of blocksToQuery) {
  await measureFn(
    `Blocks ${Math.min(...blocks)}-${Math.max(...blocks)}`,
    () => Promise.all(blocks.map((number) => getBlock(web3, number))),
  );
}
