import { getInjectedProvider } from "./provider";
export async function checkNetwork() {

  const provider = getInjectedProvider();
  if (!provider) {
    return false;
  }

  try {
    const chainId = await getInjectedProvider()?.request({
      method: "eth_chainId",
    });

    return parseInt(chainId as string, 16) === 984;
  } catch {
    return false;
  }
}
