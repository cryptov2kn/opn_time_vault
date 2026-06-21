export function getInjectedProvider() {
  if (window.okxwallet) {
    return window.okxwallet;
  }

  if (window.ethereum) {
    return window.ethereum;
  }

  return undefined;
}
