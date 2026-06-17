type ActionButtonsProps = {
  isConnected: boolean;
  isCorrectNetwork: boolean;

  isLocking: boolean;
  isUnlocking: boolean;

  lockedValue: number;
  canUnlock: boolean;

  onLock: () => void;
  onUnlock: () => void;
};

export default function ActionButtons({
  isConnected,
  isCorrectNetwork,
  isLocking,
  isUnlocking,
  lockedValue,
  canUnlock,
  onLock,
  onUnlock,
}: ActionButtonsProps) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3">
      <button
        onClick={onLock}
        disabled={
          !isConnected || !isCorrectNetwork || isLocking || lockedValue > 0
        }
        className="
          rounded-xl
          bg-white
          py-3
          font-semibold
          text-black
          transition-all
          duration-200
          hover:scale-[1.02]
          hover:-translate-y-0.5
          hover:shadow-lg
          hover:shadow-white/20
          disabled:opacity-50
          disabled:cursor-not-allowed
          disabled:hover:scale-100
          disabled:hover:translate-y-0
        "
      >
        {isLocking ? "Locking..." : "Lock Assets"}
      </button>

      <button
        onClick={onUnlock}
        disabled={
          !isConnected ||
          !isCorrectNetwork ||
          isUnlocking ||
          !canUnlock ||
          lockedValue === 0
        }
        className="
          rounded-xl
          border
          border-gray-700
          py-3
          text-gray-300
          transition-all
          duration-200
          hover:bg-gray-700
          hover:text-white
          hover:border-gray-500
          hover:scale-[1.02]
          hover:-translate-y-0.5
          disabled:opacity-50
          disabled:cursor-not-allowed
          disabled:hover:bg-transparent
          disabled:hover:text-gray-300
          disabled:hover:scale-100
          disabled:hover:translate-y-0
        "
      >
        {isUnlocking ? "Unlocking..." : "Unlock Assets"}
      </button>
    </div>
  );
}
