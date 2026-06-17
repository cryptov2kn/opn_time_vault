import {
  BrowserProvider,
  Contract,
  formatEther,
  EventLog,
  DeferredTopicFilter,
} from "ethers";

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config/contract";

import type { HistoryItem } from "../types/history";

export async function getHistory(
  walletAddress: string,
): Promise<HistoryItem[]> {

const cacheKey =
  `history_${walletAddress}`;

const cached =
  localStorage.getItem(
    cacheKey,
  );

if (cached) {
  console.log(
    "Loaded history from cache",
  );

  return JSON.parse(
    cached,
  );
}

  const provider = new BrowserProvider(window.ethereum!);

  const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

  async function getEventsInChunks(
    filter: DeferredTopicFilter,
    startBlock: number,
    endBlock: number,
  ) {
    const CHUNK_SIZE = 10000;

    const requests = [];
    for (let from = startBlock; from <= endBlock; from += CHUNK_SIZE) {
      const to = Math.min(from + CHUNK_SIZE - 1, endBlock);

      console.log(`Queue ${from} -> ${to}`);

      requests.push(contract.queryFilter(filter, from, to));
    }
    const results = await Promise.all(requests);
    const events = results.flat();
    return events;
  }

  const DEPLOY_BLOCK = 18330000;
  //const DEPLOY_BLOCK = 17966994;

  const currentBlock = await provider.getBlockNumber();

  const [lockedEvents, unlockedEvents] = await Promise.all([
    getEventsInChunks(
      contract.filters.Locked(walletAddress),
      DEPLOY_BLOCK,
      currentBlock,
    ),

    getEventsInChunks(
      contract.filters.Unlocked(walletAddress),
      DEPLOY_BLOCK,
      currentBlock,
    ),
  ]);

  const blockCache = new Map<number, number>();
  async function getBlockTimestamp(blockNumber: number) {
    const cached = blockCache.get(blockNumber);

    if (cached) {
      return cached;
    }

    const block = await provider.getBlock(blockNumber);

    const timestamp = block?.timestamp ?? 0;

    blockCache.set(blockNumber, timestamp);

    return timestamp;
  }

  const lockHistory = await Promise.all(
    lockedEvents.map(async (event) => {
      const e = event as EventLog;

      const timestamp = await getBlockTimestamp(e.blockNumber);

      return {
        type: "lock" as const,

        amount: formatEther(e.args.amount),

        timestamp,

        txHash: e.transactionHash,
      };
    }),
  );

  const unlockHistory = await Promise.all(
    unlockedEvents.map(async (event) => {
      const e = event as EventLog;

      const timestamp = await getBlockTimestamp(e.blockNumber);

      return {
        type: "unlock" as const,

        amount: formatEther(e.args.amount),

        timestamp,

        txHash: e.transactionHash,
      };
    }),
  );

  const history = [...lockHistory, ...unlockHistory];

  history.sort((a, b) => b.timestamp - a.timestamp);

  localStorage.setItem(
  cacheKey,
  JSON.stringify(history),
);

return history;
}
