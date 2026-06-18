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

  bg-gradient-to-b
  from-white
  to-gray-200

  py-3

  font-semibold
  text-black

  border
  border-white/30

  shadow-lg
  shadow-white/10

  transition-all
  duration-200

  hover:scale-[1.02]
  hover:-translate-y-0.5

  hover:shadow-xl
  hover:shadow-white/25

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
  py-3
  text-white
  transition-all
  duration-200

  ${
    canUnlock
      ? `
        border border-green-500/30
        bg-gradient-to-b
        from-gray-700
        to-gray-900

        shadow-lg
        shadow-green-500/10

        hover:border-green-400/50
        hover:shadow-green-500/20
        hover:scale-[1.02]
        hover:-translate-y-0.5
      `
      : `
        border border-gray-700
        bg-gray-900
        text-gray-400
      `
  }

  disabled:opacity-50
  disabled:cursor-not-allowed
  disabled:hover:scale-100
  disabled:hover:translate-y-0
        "
      >
        {isUnlocking ? "Unlocking..." : "Unlock Assets"}
      </button>
    </div>
  );
}
