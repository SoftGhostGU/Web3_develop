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
    
    uint256 MINIMUM_VALUE = 1 * 10 ** 18; // 设置最小转账为1Ether
    AggregatorV3Interface internal dataFeed;

    constructor() {
        // Sepolia测试网中ETH-USD的地址
        dataFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);

    }
    
    function fund() external payable {
        require(msg.value >= MINIMUM_VALUE, "Send more ETH");
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
        return ethAmount * ethPrice;
    }
}