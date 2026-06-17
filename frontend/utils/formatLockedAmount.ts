export function formatLockedAmount(amount: number) {
  if (amount === 0) {
    return "No Assets Locked";
  }

  return `${parseFloat(amount.toFixed(4))} OPN`;
}
