import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config/contract";

export async function getLockInfo(walletAddress: string) {
  const provider = new BrowserProvider(window.ethereum!);
  const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  const result = await contract.locks(walletAddress);

  return {
    amount: formatEther(result.amount),
    unlockTime: Number(result.unlockTime),
  };
}

export async function lockAssets(amount: string, duration: number) {
  const provider = new BrowserProvider(window.ethereum!);
  const signer = await provider.getSigner();
  const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  const tx = await contract.lock(duration, {
    value: parseEther(amount),
  });
  await tx.wait();
  return tx.hash;
}

export async function unlockAssets() {
  const provider = new BrowserProvider(window.ethereum!);
  const signer = await provider.getSigner();
  const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  const tx = await contract.unlock();
  await tx.wait();
  return tx.hash;
}
