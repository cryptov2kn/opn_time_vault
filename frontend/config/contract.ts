export const CONTRACT_ADDRESS = "0xd97a6c240c23cf4e0c456dff2f22491070c5d21d";

export const CONTRACT_ABI = [
  "function locks(address) view returns (uint256 amount, uint256 unlockTime)",

  "function lock(uint256 duration) payable",

  "function unlock()",

  "function getLockInfo(address user) view returns (uint256 amount, uint256 unlockTime)",

  "event Locked(address indexed user,uint256 amount,uint256 unlockTime)",

  "event Unlocked(address indexed user,uint256 amount)",
];

