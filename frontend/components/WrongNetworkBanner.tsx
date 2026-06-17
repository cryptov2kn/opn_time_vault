export default function WrongNetworkBanner() {
  return (
    <div
      className="
        mt-4
        rounded-xl
        border
        border-yellow-500/30
        bg-yellow-500/10
        p-3
        text-center
      "
    >
      <p className="text-sm font-semibold text-yellow-400">⚠ Wrong Network</p>

      <p className="mt-1 text-xs text-yellow-300">
        Please switch to OPN Testnet
      </p>
    </div>
  );
}
