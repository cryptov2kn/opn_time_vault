// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OPNLocker {

struct LockInfo {
    uint256 amount;
    uint256 unlockTime;
}

mapping(address => LockInfo) public locks;

event Locked(
    address indexed user,
    uint256 amount,
    uint256 unlockTime
);

event Unlocked(
    address indexed user,
    uint256 amount
);

function lock(uint256 duration) external payable {

    require(msg.value > 0, "No funds");

    require(
        duration > 0 &&
        duration <= 365 days,
        "Invalid duration"
    );

    require(
        locks[msg.sender].amount == 0,
        "Already locked"
    );

    uint256 unlockTime = block.timestamp + duration;

    locks[msg.sender] = LockInfo({
        amount: msg.value,
        unlockTime: unlockTime
    });

    emit Locked(
        msg.sender,
        msg.value,
        unlockTime
    );
}

function unlock() external {

    LockInfo memory info = locks[msg.sender];

    require(
        info.amount > 0,
        "No lock found"
    );

    require(
        block.timestamp >= info.unlockTime,
        "Still locked"
    );

    delete locks[msg.sender];

    (bool success, ) = payable(msg.sender)
        .call{value: info.amount}("");

    require(
        success,
        "Transfer failed"
    );

    emit Unlocked(
        msg.sender,
        info.amount
    );
}

function getLockInfo(address user)
    external
    view
    returns (
        uint256 amount,
        uint256 unlockTime
    )
{
    LockInfo memory info = locks[user];

    return (
        info.amount,
        info.unlockTime
    );
}

}
