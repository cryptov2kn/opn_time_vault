import {
  BrowserProvider,
  Contract,
  formatEther,
  EventLog,
  DeferredTopicFilter,
} from "ethers";

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config/contract";

import type { HistoryItem } from "../types/history";

import { getInjectedProvider } from "./provider";

export async function getHistoryV2(
  walletAddress: string,
): Promise<HistoryItem[]> {
  const historyKey = `history_${walletAddress}`;

  const lastBlockKey = `history_lastBlock_${walletAddress}`;

  const cachedHistory = localStorage.getItem(historyKey);

  const cachedLastBlock = localStorage.getItem(lastBlockKey);

  const oldHistory: HistoryItem[] = cachedHistory
    ? JSON.parse(cachedHistory)
    : [];

  const lastBlock = cachedLastBlock ? Number(cachedLastBlock) : null;

  const provider = new BrowserProvider(getInjectedProvider()!);

  const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

  const DEPLOY_BLOCK = 19880000;

  const latestBlock = await provider.getBlock("latest");

  if (!latestBlock) {
    return oldHistory;
  }

  const currentBlock = latestBlock.number;

  const latestSyncedBlock = currentBlock;

  const startBlock = lastBlock !== null ? lastBlock + 1 : DEPLOY_BLOCK;

  if (startBlock > currentBlock) {
    return oldHistory;
  }

  async function getEventsInChunks(
    filter: DeferredTopicFilter,
    startBlock: number,
    endBlock: number,
  ) {
    const CHUNK_SIZE = 10000;

    const requests = [];

    for (let from = startBlock; from <= endBlock; from += CHUNK_SIZE) {
      const to = Math.min(from + CHUNK_SIZE - 1, endBlock);

      requests.push(contract.queryFilter(filter, from, to));
    }

    const results = await Promise.all(requests);

    return results.flat();
  }

  const [lockedEvents, unlockedEvents] = await Promise.all([
    getEventsInChunks(
      contract.filters.Locked(walletAddress),
      startBlock,
      currentBlock,
    ),

    getEventsInChunks(
      contract.filters.Unlocked(walletAddress),
      startBlock,
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

  const newHistory = [...lockHistory, ...unlockHistory];

  const mergedHistory = [...newHistory, ...oldHistory];

  const seen = new Set<string>();

  const uniqueHistory = mergedHistory.filter((item) => {
    if (seen.has(item.txHash)) {
      return false;
    }

    seen.add(item.txHash);

    return true;
  });

  uniqueHistory.sort((a, b) => b.timestamp - a.timestamp);

  localStorage.setItem(historyKey, JSON.stringify(uniqueHistory));

  localStorage.setItem(lastBlockKey, latestSyncedBlock.toString());

  return uniqueHistory;
}
