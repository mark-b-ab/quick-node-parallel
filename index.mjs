import { chunk, measureFn, range, retry } from './utils.mjs';
import { makeWeb3 }                       from './web3.mjs';

if (!process.argv[2]) {
  console.log('Usage: node index.mjs <node-url> [<parallelism>]');
  process.exit(1);
}

const web3 = makeWeb3(process.argv[2]);
const parallelism = process.argv[3] || 10;

export async function getBlock(number) {
  const [block, traces, receipts] = await Promise.all([
    retry(() => web3.eth.getBlock(number, true)),
    retry(() => web3.eth.getBlockTracesParity(number)),
    retry(() => web3.eth.getBlockReceiptsParity(number)),
  ]);

  block.traces = traces;
  block.receipts = receipts;

  return block;
}

const blocksToQuery = chunk(range(100_000, 110_000), parallelism);

for (const blocks of blocksToQuery) {
  await measureFn(
    `Blocks ${Math.min(...blocks)}-${Math.max(...blocks)}`,
    () => Promise.all(blocks.map(getBlock)),
  );
}
