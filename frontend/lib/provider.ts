export function getInjectedProvider() {
  return window.ethereum || window.okxwallet;
}
