import { Copy, ExternalLink } from "lucide-react";

type WalletCardProps = {
  address: string;
  balance: string;
  isConnected: boolean;
  onConnect: () => void;
  onCopy: () => void;
  onExplorer: () => void;
};

export default function WalletCard({
  address,
  balance,
  isConnected,
  onConnect,
  onCopy,
  onExplorer,
}: WalletCardProps) {
  return (
    <div className="mt-6 rounded-2xl bg-gray-800 p-4 border border-gray-700">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-400">Wallet</p>

          <div className="mt-1 flex items-center gap-2">
            <span className="text-white text-sm">{address}</span>

            {isConnected && (
              <>
                <button
                  onClick={onCopy}
                  title="Copy address"
                  className="
                    text-gray-500
                    transition-all
                    duration-200
                    hover:text-white
                    hover:scale-110
                  "
                >
                  <Copy size={14} />
                </button>

                <button
                  onClick={onExplorer}
                  title="View on Explorer"
                  className="
                    text-gray-500
                    transition-all
                    duration-200
                    hover:text-white
                    hover:scale-110
                  "
                >
                  <ExternalLink size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-400">Balance</p>

          <p className="text-white text-sm mt-1 font-medium">{balance}</p>
        </div>
      </div>

      <button
        onClick={onConnect}
        className="
          w-full
          mt-4
          rounded-xl
          border
          border-gray-600
          py-3
          text-white
          hover:bg-gray-700
          hover:scale-[1.02]
          hover:-translate-y-0.5
          transition
        "
      >
        Connect Wallet
      </button>
    </div>
  );
}
