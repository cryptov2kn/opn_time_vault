export async function checkNetwork() {
  if (!window.ethereum) {
    return false;
  }

  try {
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    return parseInt(chainId as string, 16) === 984;
  } catch {
    return false;
  }
}
