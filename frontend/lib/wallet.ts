import { BrowserProvider, formatEther } from "ethers";

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("Wallet not found");
  }

  const provider = new BrowserProvider(
    window.ethereum
  );

  await provider.send(
    "eth_requestAccounts",
    []
  );

  const signer = await provider.getSigner();

  const address = await signer.getAddress();

  const balanceWei =
    await provider.getBalance(address);

  const balance =
    formatEther(balanceWei);

  return {
    provider,
    signer,
    address,
    balance,
  };
}