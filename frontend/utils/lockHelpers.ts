export function formatUnlockDate(unlockTime: number) {
  const unlock = new Date(unlockTime * 1000);

  const datePart = unlock.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const timePart = unlock.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const offsetMinutes = -new Date().getTimezoneOffset();

  const offsetHours = offsetMinutes / 60;

  const timezone = `UTC${offsetHours >= 0 ? "+" : ""}${offsetHours}`;

  return `${datePart} • ${timePart} ${timezone}`;
}

export function getLockStatus(unlockTime: number) {
  const remaining = unlockTime - Math.floor(Date.now() / 1000);

  return {
    canUnlock: remaining <= 0,
    remaining,
  };
}
