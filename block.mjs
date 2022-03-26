import { retry } from './retry.mjs';

export async function getBlock(web3, number) {
  const [block, traces, receipts] = await Promise.all([
    retry(() => web3.eth.getBlock(number, true)),
    retry(() => web3.eth.getBlockTracesParity(number)),
    retry(() => web3.eth.getBlockReceiptsParity(number)),
  ]);

  block.traces = traces;
  block.receipts = receipts;

  return block;
}

