import { formatters } from 'web3-core-helpers';
import Web3           from 'web3';

const parityExtension = {
  property: 'eth',
  methods: [
    {
      name: 'getBlockReceiptsParity',
      call: 'parity_getBlockReceipts',
      params: 1,
      inputFormatter: [formatters.inputBlockNumberFormatter],
      outputFormatter: (data) => data,
    },
    {
      name: 'getBlockTracesParity',
      call: 'trace_block',
      params: 1,
      inputFormatter: [formatters.inputBlockNumberFormatter],
      outputFormatter: formatters.outputTransactionReceiptFormatter,
    },
  ],
}

export function makeWeb3(node) {
  const web3 = new Web3(new Web3.providers.HttpProvider(node, { timeout: 3000 }));

  web3.extend(parityExtension);

  return web3;
}
