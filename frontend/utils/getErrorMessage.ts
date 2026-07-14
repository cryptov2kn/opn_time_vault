// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getErrorMessage(error: any) {
  if (!error) return "Unknown error";

  if (error.code === "ACTION_REJECTED" || error.code === 4001) {
    return "Transaction cancelled";
  }

  const message = (error.message || "").toLowerCase();

  if (message.includes("user rejected")) {
    return "Transaction cancelled";
  }

  // ===== ADD THIS BLOCK =====
  if (
    message.includes("json-rpc") ||
    message.includes("unknown_error") ||
    message.includes("internal json-rpc error") ||
    message.includes("height") ||
    message.includes("rpc endpoint returned too many errors")
  ) {
    return "OPN Testnet RPC is temporarily busy. Please wait a few seconds and try again.";
  }
  // ==========================

  if (message.includes("insufficient funds")) {
    return "Insufficient balance for gas";
  }

  if (message.includes("execution reverted")) {
    const parts = error.message.split("execution reverted:");

    if (parts[1]) {
      return parts[1].trim();
    }
  }

  return error.message || "Transaction failed";
}
