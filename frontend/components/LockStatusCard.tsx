type LockStatusCardProps = {
  status: string;
  isConnected: boolean;
  lockedValue: number;
  canUnlock: boolean;
  lockedAmount: string;
  remainingTime: string;
  unlockDate: string;
};

export default function LockStatusCard({
  status,
  isConnected,
  lockedValue,
  canUnlock,
  lockedAmount,
  remainingTime,
  unlockDate,
}: LockStatusCardProps) {
  return (
    <div className="mt-5 rounded-2xl bg-gray-800 p-4 border border-gray-700">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-400">Lock Status</p>

        <p
          className={`text-sm font-semibold ${
            !isConnected
              ? "text-gray-400"
              : lockedValue === 0
                ? "text-green-400"
                : canUnlock
                  ? "text-green-400"
                  : "text-yellow-400"
          }`}
        >
          {status}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-400">Locked</p>

          <p className="text-white mt-1">{isConnected ? lockedAmount : "--"}</p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-400">Remaining</p>

          <p className="text-white mt-1 font-medium">
            {isConnected ? remainingTime : "--"}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-700 pt-4">
        <p className="text-xs text-gray-400">Estimated Unlock</p>

        <p className="text-white mt-1">{isConnected ? unlockDate : "--"}</p>
      </div>
    </div>
  );
}
