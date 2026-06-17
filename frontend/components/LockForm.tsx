type LockFormProps = {
  amount: string;
  duration: string;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  quickButtonClass: string;

  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  onDurationChange: (value: string) => void;

  onFill25: () => void;
  onFill50: () => void;
  onFill75: () => void;
  onFillMax: () => void;
};

export default function LockForm({
  amount,
  duration,
  isConnected,
  isCorrectNetwork,
  quickButtonClass,
  onAmountChange,
  onDurationChange,
  onFill25,
  onFill50,
  onFill75,
  onFillMax,
}: LockFormProps) {
  return (
    <>
      {/* Amount */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm text-gray-300">Amount</label>

          <div className="flex gap-1">
            <button
              className={quickButtonClass}
              disabled={!isConnected || !isCorrectNetwork}
              onClick={onFill25}
            >
              25%
            </button>

            <button
              className={quickButtonClass}
              disabled={!isConnected || !isCorrectNetwork}
              onClick={onFill50}
            >
              50%
            </button>

            <button
              className={quickButtonClass}
              disabled={!isConnected || !isCorrectNetwork}
              onClick={onFill75}
            >
              75%
            </button>

            <button
              className={quickButtonClass}
              disabled={!isConnected || !isCorrectNetwork}
              onClick={onFillMax}
            >
              MAX
            </button>
          </div>
        </div>

        <div className="flex items-center rounded-xl border border-gray-700 bg-gray-800 px-4 py-3">
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={onAmountChange}
            placeholder="0.00"
            disabled={!isConnected || !isCorrectNetwork}
            className="flex-1 bg-transparent text-white outline-none"
          />

          <span className="text-gray-400">OPN</span>
        </div>
      </div>

      {/* Duration */}
      <div className="mt-5">
        <label className="block text-sm text-gray-300 mb-2">
          Lock Duration
        </label>

        <div className="relative">
          <select
            value={duration}
            disabled={!isConnected || !isCorrectNetwork}
            onChange={(e) => onDurationChange(e.target.value)}
            className="
              w-full
              appearance-none
              rounded-xl
              border
              border-gray-700
              bg-gray-800
              p-3
              pr-10
              text-white
            "
          >
            <option value="60">1 Minute</option>

            <option value="3600">1 Hour</option>

            <option value="86400">1 Day</option>

            <option value="604800">7 Days</option>

            <option value="2592000">30 Days</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
