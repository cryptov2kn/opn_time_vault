"use client";
import { useCallback, useEffect, useState } from "react";
import { getInjectedProvider } from "@/lib/provider";

import { connectWallet } from "../lib/wallet";
import { getLockInfo, lockAssets, unlockAssets } from "../lib/contract";
import { checkNetwork } from "@/lib/network";
import { getHistory } from "@/lib/history";

import { formatBalance } from "@/utils/formatBalance";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { formatRemainingTime } from "@/utils/formatRemainingTime";
import { formatLockedAmount } from "@/utils/formatLockedAmount";
import { formatUnlockDate, getLockStatus } from "@/utils/lockHelpers";
import { getStatus } from "@/utils/statusHelpers";

import { GAS_RESERVE } from "@/constants/network";
import { quickButtonClass } from "@/constants/styles";

import type { NotificationData } from "@/types/notification";
import type { HistoryItem } from "@/types/history";

import Notification from "@/components/Notification";
import WalletCard from "@/components/WalletCard";
import WrongNetworkBanner from "@/components/WrongNetworkBanner";
import LockStatusCard from "@/components/LockStatusCard";
import LockForm from "@/components/LockForm";
import ActionButtons from "@/components/ActionButtons";
import HistoryCard from "@/components/HistoryCard";

export default function Home() {
  const [address, setAddress] = useState("Connect your wallet");

  const [fullAddress, setFullAddress] = useState("");

  const [isConnected, setIsConnected] = useState(false);

  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);

  const [canUnlock, setCanUnlock] = useState(false);

  const [balance, setBalance] = useState("0 OPN");

  const [rawBalance, setRawBalance] = useState(0);

  const [lockedValue, setLockedValue] = useState(0);

  const [lockedAmount, setLockedAmount] = useState("0 OPN");

  const [remainingTime, setRemainingTime] = useState("--");

  const [unlockDate, setUnlockDate] = useState("Not Locked");

  const [unlockTimestamp, setUnlockTimestamp] = useState(0);

  const [amount, setAmount] = useState("");

  const [duration, setDuration] = useState("60");

  const [isLocking, setIsLocking] = useState(false);

  const [isUnlocking, setIsUnlocking] = useState(false);

  const [activeTab, setActiveTab] = useState<"lock" | "history">("lock");

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [historyWallet, setHistoryWallet] = useState("");

  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const [walletChanging, setWalletChanging] = useState(false);

  const [historyLoaded, setHistoryLoaded] = useState(false);

  const [historyFilter, setHistoryFilter] = useState<"all" | "lock" | "unlock">(
    "all",
  );

  const [notification, setNotification] = useState<NotificationData | null>(
    null,
  );

  // 2. HELPER FUNCTIONS
  function showNotification(message: string, type: "success" | "error") {
    setNotification({
      message,
      type,
    });

    const duration = type === "success" ? 5000 : 8000;

    setTimeout(() => {
      setNotification(null);
    }, duration);
  }

  function fillAmount(percent: number) {
    setAmount(formatBalance(rawBalance * percent));
  }

  function fillMaxAmount() {
    const maxAmount = Math.max(rawBalance - GAS_RESERVE, 0);

    setAmount(formatBalance(maxAmount));
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (value === "") {
      setAmount("");
      return;
    }

    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    setAmount(value);
  }

  function resetWalletState() {
    setIsConnected(false);

    setAddress("Connect your wallet");
    setFullAddress("");

    setBalance("0 OPN");
    setRawBalance(0);

    setHistory([]);
    setHistoryLoaded(false);

    setLockedValue(0);
    setLockedAmount("No Assets Locked");

    setRemainingTime("--");

    setUnlockDate("Not Locked");

    setUnlockTimestamp(0);

    setCanUnlock(false);

    setHistory([]);
  }

  function clearHistoryCache() {
    if (!fullAddress) {
      return;
    }

    localStorage.removeItem(`history_${fullAddress}`);

    setHistory([]);
    setHistoryLoaded(false);
  }
  // 3. WALLET FUNCTIONS

  const loadWalletData = useCallback(
    async (wallet: { address: string; balance: string | number }) => {
      setFullAddress(wallet.address);
      const shortAddress =
        wallet.address.slice(0, 6) + "..." + wallet.address.slice(-4);

      setAddress(shortAddress);

      setRawBalance(Number(wallet.balance));

      setBalance(formatBalance(wallet.balance) + " OPN");

      setIsConnected(true);

      getLockInfo(wallet.address)
        .then((lockInfo) => {
          const amount = Number(lockInfo.amount);

          setLockedValue(amount);

          setLockedAmount(formatLockedAmount(amount));

          if (lockInfo.unlockTime > 0) {
            setUnlockTimestamp(lockInfo.unlockTime);

            setUnlockDate(formatUnlockDate(lockInfo.unlockTime));

            const { canUnlock, remaining } = getLockStatus(lockInfo.unlockTime);

            if (canUnlock) {
              setCanUnlock(true);

              setRemainingTime("Ready");
            } else {
              setCanUnlock(false);

              setRemainingTime(formatRemainingTime(remaining));
            }
          } else {
            setUnlockTimestamp(0);

            setRemainingTime("--");

            setUnlockDate("No Active Lock");

            setCanUnlock(false);
          }
        })
        .catch(console.error);
    },
    [],
  );

  const handleConnect = useCallback(async () => {
    try {
      const wallet = await connectWallet();

      await checkNetwork();

      setHistoryLoaded(false);
      await loadWalletData(wallet);
    } catch (error) {
      console.error(error);
    }
  }, [loadWalletData]);

  const loadHistory = useCallback(async () => {
    if (!fullAddress) {
      return;
    }

    if (historyLoaded && history.length > 0) {
      return;
    }

    try {
      setIsHistoryLoading(true);
      const data = await getHistory(fullAddress);
      setHistory(data);
      setHistoryWallet(fullAddress);
      setHistoryLoaded(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsHistoryLoading(false);
      setWalletChanging(false);
    }
  }, [fullAddress, historyLoaded, history.length]);

  const refreshHistory = async () => {
    if (!fullAddress) {
      return;
    }

    try {
      setIsHistoryLoading(true);

      localStorage.removeItem(`history_${fullAddress}`);

      const data = await getHistory(fullAddress);
      console.log(`History updated: ${data.length} transactions`);

      setHistory(data);
      setHistoryWallet(fullAddress);
      setHistoryLoaded(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  // 4. CONTRACT FUNCTIONS
  async function handleLock() {
    if (!isConnected) {
      showNotification("Please connect wallet first", "error");
      return;
    }
    if (!amount) {
      showNotification("Please enter amount", "error");

      return;
    }
    if (isNaN(Number(amount))) {
      showNotification("Invalid amount", "error");

      return;
    }
    if (Number(amount) <= 0) {
      showNotification("Amount must be greater than 0", "error");

      return;
    }
    if (Number(amount) > Number(balance.replace(" OPN", ""))) {
      showNotification("Insufficient balance", "error");

      return;
    }
    if (lockedValue > 0) {
      showNotification("Assets already locked", "error");
      return;
    }
    if (Number(amount) > rawBalance - GAS_RESERVE) {
      showNotification(`Keep at least ${GAS_RESERVE} OPN for gas`, "error");

      return;
    }
    try {
      setIsLocking(true);

      await lockAssets(amount, Number(duration));

      showNotification("Assets locked successfully", "success");

      await handleConnect();

      clearHistoryCache();

      setTimeout(() => {
        refreshHistory();
      }, 5000);

      console.log("Lock completed and history refreshed");
    } catch (error) {
      console.error(error);

      showNotification(getErrorMessage(error), "error");
    } finally {
      setIsLocking(false);
    }
  }

  async function handleUnlock() {
    try {
      setIsUnlocking(true);

      await unlockAssets();

      showNotification("Assets unlocked successfully", "success");

      await handleConnect();

      clearHistoryCache();

      setTimeout(() => {
        refreshHistory();
      }, 5000);

      console.log("Unlock completed and history refreshed");
    } catch (error) {
      console.error(error);

      showNotification(getErrorMessage(error), "error");
    } finally {
      setIsUnlocking(false);
    }
  }

  async function copyAddress() {
    if (!isConnected || !fullAddress) {
      return;
    }

    try {
      await navigator.clipboard.writeText(fullAddress);

      showNotification("Address copied", "success");
    } catch (error) {
      console.error(error);

      showNotification("Copy failed", "error");
    }
  }

  function openExplorer() {
    if (!isConnected || !fullAddress) {
      return;
    }

    window.open(`https://testnet.iopn.tech/address/${fullAddress}`, "_blank");
  }

  /*async function autoConnect() {
    try {
      if (!window.ethereum) {
        return;
      }

      const accounts = (await window.ethereum.request({
        method: "eth_accounts",
      })) as string[];

      if (accounts.length === 0) {
        return;
      }

      const wallet = await connectWallet();

      await loadWalletData(wallet);
    } catch (error) {
      console.error("Auto connect failed:", error);
    }
  }*/

  // 5. REALTIME EFFECTS
  useEffect(() => {
    const ethereum = getInjectedProvider();

    if (!ethereum) {
      return;
    }

    const handleAccountsChanged = async (accounts: unknown) => {
      const walletAccounts = accounts as string[];

      if (walletAccounts.length === 0) {
        resetWalletState();
        return;
      }

      try {
        setWalletChanging(true);
        setIsHistoryLoading(true);

        await handleConnect();

        setHistoryLoaded(false);
      } catch (error) {
        console.error(error);
      } finally {
        setWalletChanging(false);
        setIsHistoryLoading(false);
      }
    };

    ethereum.on?.("accountsChanged", handleAccountsChanged);

    return () => {
      ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, [handleConnect]);

  useEffect(() => {
    if (!unlockTimestamp) return;

    const interval = setInterval(() => {
      const remaining = unlockTimestamp - Math.floor(Date.now() / 1000);

      if (remaining <= 0) {
        setCanUnlock(true);
        setRemainingTime("Ready");

        clearInterval(interval);

        return;
      }

      setRemainingTime(formatRemainingTime(remaining));
    }, 1000);

    return () => clearInterval(interval);
  }, [unlockTimestamp]);

  useEffect(() => {
    const ethereum = getInjectedProvider();

    if (!ethereum?.on) {
      return;
    }

    const handleChainChanged = async () => {
      const isCorrect = await checkNetwork();

      setIsCorrectNetwork(isCorrect);
    };

    ethereum.on?.("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener?.("chainChanged", handleChainChanged);
    };
  }, []);

  useEffect(() => {
    if (activeTab === "history" && fullAddress && !historyLoaded) {
      queueMicrotask(() => {
        void loadHistory();
      });
    }
  }, [activeTab, fullAddress, historyLoaded, loadHistory]);

  /*useEffect(() => {
    void autoConnect();
  }, []);*/

  const status = getStatus(isConnected, lockedValue, canUnlock);

  return (
    <>
      {/* Notification */}
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <main
        className="min-h-screen
    bg-gradient-to-br
    from-slate-950
    via-blue-950
    to-slate-950
    flex
    items-center
    justify-center
    p-4"
      >
        {/* Glow */}
        <div
          className="
      absolute
      w-[700px]
      h-[700px]
      rounded-full
      bg-cyan-500/5
      blur-[140px]
      pointer-events-none
    "
        />
        <div className="relative z-10 w-full max-w-md">
          {/* Navigation */}
          <div
            className="
    mb-6
    flex
    rounded-full
    border
    border-gray-800
    bg-[#111827]
    p-1
  "
          >
            <button
              onClick={() => setActiveTab("lock")}
              className={`
         flex-1
rounded-full
py-3
text-base
font-medium
transition-all
duration-200
hover:scale-[1.01]
          ${
            activeTab === "lock"
              ? "bg-[#1f2937] text-white shadow-md"
              : "text-gray-500 hover:text-gray-300"
          }
        `}
            >
              Lock
            </button>

            <button
              onClick={async () => {
                setActiveTab("history");

                await loadHistory();
              }}
              className={`
        flex-1
rounded-full
py-3
text-base
font-medium
transition-all
duration-200
hover:scale-[1.01]
          ${
            activeTab === "history"
              ? "bg-[#1f2937] text-white shadow-md"
              : "text-gray-500 hover:text-gray-300"
          }
        `}
            >
              History
            </button>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
            {/* Header */}
            <h1 className="text-3xl font-bold text-center text-white">
              OPN Time Vault
            </h1>
            <p className="text-center text-gray-400 mt-2">
              Lock assets securely on-chain
            </p>
            {isConnected && !isCorrectNetwork && <WrongNetworkBanner />}

            {activeTab === "lock" && (
              <>
                <WalletCard
                  address={address}
                  balance={balance}
                  isConnected={isConnected}
                  onConnect={handleConnect}
                  onCopy={copyAddress}
                  onExplorer={openExplorer}
                />

                <LockForm
                  amount={amount}
                  duration={duration}
                  isConnected={isConnected}
                  isCorrectNetwork={isCorrectNetwork}
                  quickButtonClass={quickButtonClass}
                  onAmountChange={handleAmountChange}
                  onDurationChange={setDuration}
                  onFill25={() => fillAmount(0.25)}
                  onFill50={() => fillAmount(0.5)}
                  onFill75={() => fillAmount(0.75)}
                  onFillMax={fillMaxAmount}
                />

                <LockStatusCard
                  status={status}
                  isConnected={isConnected}
                  lockedValue={lockedValue}
                  canUnlock={canUnlock}
                  lockedAmount={lockedAmount}
                  remainingTime={remainingTime}
                  unlockDate={unlockDate}
                />

                <ActionButtons
                  isConnected={isConnected}
                  isCorrectNetwork={isCorrectNetwork}
                  isLocking={isLocking}
                  isUnlocking={isUnlocking}
                  lockedValue={lockedValue}
                  canUnlock={canUnlock}
                  onLock={handleLock}
                  onUnlock={handleUnlock}
                />
              </>
            )}

            {activeTab === "history" && (
              <HistoryCard
                history={history}
                isConnected={isConnected}
                isLoading={isHistoryLoading}
                historyWallet={historyWallet}
                currentWallet={fullAddress}
                filter={historyFilter}
                walletChanging={walletChanging}
                onFilterChange={setHistoryFilter}
                onRefresh={refreshHistory}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
