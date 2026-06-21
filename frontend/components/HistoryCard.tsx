import type { HistoryItem } from "@/types/history";
import { RefreshCw } from "lucide-react";

function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp * 1000);

  const datePart = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const timePart = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${datePart} • ${timePart}`;
}

function openTx(txHash: string) {
  window.open(`https://testnet.iopn.tech/tx/${txHash}`, "_blank");
}

type HistoryCardProps = {
  history: HistoryItem[];
  isConnected: boolean;
  isLoading: boolean;
  historyWallet: string;
  currentWallet: string;
  walletChanging: boolean;
  filter: "all" | "lock" | "unlock";
  onFilterChange: (filter: "all" | "lock" | "unlock") => void;
  onRefresh: () => void;
};

export default function HistoryCard({
  history,
  isConnected,
  isLoading,
  filter,
  historyWallet,
  currentWallet,
  walletChanging,
  onFilterChange,
  onRefresh,
}: HistoryCardProps) {
  if (!isConnected) {
    return (
      <div className="mt-5 rounded-2xl border border-gray-700 bg-gray-800 p-6 text-center">
        <p className="text-gray-400">Connect your wallet to view activity</p>
      </div>
    );
  }

  const filteredHistory = history.filter((item) => {
    if (filter === "all") return true;

    return item.type === filter;
  });

  const isHistoryCurrent = historyWallet === currentWallet;
  console.log("historyWallet =", historyWallet);
  console.log("currentWallet =", currentWallet);
  console.log("isHistoryCurrent =", historyWallet === currentWallet); //test new

  console.log("history.length =", history.length);
  console.log("filteredHistory.length =", filteredHistory.length);
  console.log("isLoading =", isLoading);
  console.log("walletChanging =", walletChanging);

  return (
    <div className="mt-5 rounded-2xl border border-gray-700 bg-gray-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 ml-1">
          <h3 className="font-semibold text-white">Recent Activity</h3>

          <button
            onClick={onRefresh}
            className="
    rounded-lg
    w-6 h-6
    flex items-center justify-center
    text-gray-400
    hover:bg-gray-800
    hover:text-white
    -mr-1
  "
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <span className="text-xs text-gray-500 mr-1">
          {filteredHistory.length} tx
        </span>
      </div>
      <div className="flex justify-center mb-4">
        <div
          className="
    flex
    gap-1
    p-1
    rounded-xl
    bg-gray-800/70
    border
    border-gray-700
    w-fit
    mb-3
  "
        >
          <button
            onClick={() => onFilterChange("all")}
            className={`
      min-w-[90px]
      py-2
      rounded-lg
      text-sm
      transition-all
      text-center
      ${
        filter === "all"
          ? "bg-gray-700 text-white shadow"
          : "text-gray-400 hover:text-white"
      }
    `}
          >
            All
          </button>

          <button
            onClick={() => onFilterChange("lock")}
            className={`
      min-w-[90px]
      py-2
      rounded-lg
      text-sm
      transition-all
      text-center
      ${
        filter === "lock"
          ? "bg-yellow-500/20 text-yellow-400 shadow"
          : "text-gray-400 hover:text-white"
      }
    `}
          >
            Locks
          </button>

          <button
            onClick={() => onFilterChange("unlock")}
            className={`
      min-w-[90px]
      py-2
      rounded-lg
      text-sm
      transition-all
      text-center
      ${
        filter === "unlock"
          ? "bg-green-500/20 text-green-400 shadow"
          : "text-gray-400 hover:text-white"
      }
    `}
          >
            Unlocks
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center mb-4">
          <div
            className="
        px-3
        py-1.5
        rounded-full
        bg-blue-500/10
        border
        border-blue-500/20
        text-blue-400
        text-xs
        animate-pulse
      "
          >
            Refreshing History...
          </div>
        </div>
      )}

      {walletChanging || isLoading || !isHistoryCurrent ? (
        <div
          className="
h-[320px]
space-y-3
"
        >
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="
          h-[72px]
          rounded-2xl
          bg-gray-800
          animate-pulse
        "
            />
          ))}
        </div>
      ) : filteredHistory.length === 0 ? (
        <div
          className="
h-[320px]
flex
flex-col
items-center
justify-center
text-center
rounded-2xl
border
border-dashed
border-gray-700
"
        >
          <div className="text-4xl mb-3">📭</div>

          <p className="text-white font-medium">No activity yet</p>

          <p className="text-sm text-gray-500 mt-2 max-w-[220px]">
            Your lock and unlock transactions will appear here.
          </p>
        </div>
      ) : (
        <div
          className="
history-scroll
h-[320px]
overflow-y-auto
overflow-x-hidden
space-y-3
pt-2
px-1
pb-1
"
        >
          {filteredHistory.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => openTx(item.txHash)}
                className={`flex
items-center
justify-between
rounded-2xl
px-3
py-3
border
cursor-pointer
transition-all
duration-200

hover:-translate-y-1
hover:scale-[1.01]
hover:shadow-lg

${
  item.type === "lock"
    ? `
      border-yellow-500/30
      bg-yellow-500/10

      hover:border-yellow-400/60
      hover:bg-yellow-500/15
    `
    : `
      border-emerald-500/30
      bg-emerald-500/10

      hover:border-emerald-400/60
      hover:bg-emerald-500/15
    `
}`}
              >
                <div>
                  <p
                    className={`font-medium ${
                      item.type === "lock"
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {item.type === "lock" ? "🔒 Lock" : "🔓 Unlock"}
                  </p>

                  <p className="text-xs text-gray-400">
                    {formatTimestamp(item.timestamp)}
                  </p>
                </div>

                <p className="font-semibold text-white">
                  {Number(item.amount)
                    .toFixed(3)
                    .replace(/\.?0+$/, "")}{" "}
                  OPN
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
