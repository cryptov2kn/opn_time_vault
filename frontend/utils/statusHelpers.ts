export function getStatus(
  isConnected: boolean,
  lockedValue: number,
  canUnlock: boolean,
) {
  if (!isConnected) {
    return "⚪ Not Connected";
  }

  if (lockedValue === 0) {
    return "🟢 Ready to Lock";
  }

  if (canUnlock) {
    return "🔓 Ready to Unlock";
  }

  return "🟡 Locked";
}
