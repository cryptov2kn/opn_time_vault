export function formatBalance(balance: string | number) {
  const balanceString = balance.toString();

  const [whole, decimal = ""] = balanceString.split(".");

  const trimmed = decimal.slice(0, 4);

  const cleaned = trimmed.replace(/0+$/, "");

  return cleaned ? `${whole}.${cleaned}` : whole;
}
