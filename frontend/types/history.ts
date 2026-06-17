export type HistoryItem = {
  type: "lock" | "unlock";

  amount: string;

  timestamp: number;

  txHash: string;
};
