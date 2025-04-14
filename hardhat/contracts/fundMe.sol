// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

// FundMe
// 1. 收款函数 -> 设置函数为payable
// 2. 记录投资人并查看
// 3. 在锁定期内达到目标值，生产商可以提款
// 4. 在锁定期内没有达到目标值，投资人可以退款

contract FundMe {
    mapping (address => uint256) public fundersToAmount;
    
    uint256 constant MINIMUM_VALUE = 1 * 10 ** 18; // 设置最小转账为1Ether
    uint256 constant TARGET = 1000 * 10 ** 18; // 最低提取目标值
    AggregatorV3Interface public dataFeed; // 预言机，当前环境用于知道资产的多少
    address public owner; // 部署合约的人
    uint256 deploymentTimestamp;
    uint256 lockTime;

    constructor(uint256 _lockTime, address dataFeedAddr) {
        // Sepolia测试网中ETH-USD的地址
        dataFeed = AggregatorV3Interface(dataFeedAddr);
        // 创建owner
        owner = msg.sender;
        // 时间戳
        deploymentTimestamp = block.timestamp;
        lockTime = _lockTime;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        // 把owner权力给别人
        owner = newOwner;
    }
    
    function fund() external payable {
        require(convertEthToUsd(msg.value) >= MINIMUM_VALUE, "Send more ETH");
        require(block.timestamp < deploymentTimestamp + lockTime, "Window is closed");
        fundersToAmount[msg.sender] = msg.value;
    }

    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundId */,
            int256 answer,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    function convertEthToUsd(uint256 ethAmount) internal view returns (uint256) {
        uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
        return ethAmount * ethPrice / (10 ** 8);
    }

    function getFund() external windowClosed onlyOwner {
        require(convertEthToUsd(address(this).balance) >= TARGET, "Target is not reached");
        // transfer: transfer ETH and revert if tx failed
        // payable(msg.sender).transfer(address(this).balance);

        // send: return bool whether the transfer succeed
        // bool success = payable(msg.sender).send(address(this).balance);
        // require(success, "tx failed");

        // call: transfer ETH with data return value of function and bool whether the function succeed
        bool success;
        (success, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(success, "transfer tx failed");
    }

    function refund() external windowClosed {
        require(convertEthToUsd(address(this).balance) < TARGET, "target is reaached");
        require(fundersToAmount[msg.sender] != 0, "there is no fund for you");
        // call: transfer ETH with data return value of function and bool whether the function succeed
        bool success;
        (success, ) = payable(msg.sender).call{value: fundersToAmount[msg.sender]}("");
        require(success, "transfer tx failed");
        fundersToAmount[msg.sender] = 0; // 退款后清零
    }

    modifier windowClosed() { // 修改器
        require(block.timestamp >= deploymentTimestamp + lockTime, "Window is not closed");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "This function can only called by owner");
        _;
    }
}