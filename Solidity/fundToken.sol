// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract fundToken { // 通证合约
    // 1. 定义通证的名字
    string public tokenName;
    // 2. 定义通证的简称
    string public tokenSymbol;
    // 3. 定义通证的发行数量
    uint256 public totalSupply;
    // 4. 定义合约的拥有者
    address public owner;
    // 5. 定义一个映射，用于存储每个地址的通证余额
    mapping(address => uint256) public balances;

    // 构造函数，初始化时设置通证名字、简称，并将合约部署者设置为拥有者
    constructor(string memory _tokenName, string memory _tokenSymbol) {
        tokenName = _tokenName;
        tokenSymbol = _tokenSymbol;
        owner = msg.sender;
    }

    // mint函数：用于向调用者的地址增发指定数量的通证
    function mint(uint256 amountToMint) public {
        balances[msg.sender] += amountToMint; // 增加调用者的通证余额
        totalSupply += amountToMint; // 增加通证的总发行量
    }

    // transfer函数：用于将通证从调用者的地址转移到指定的接收地址
    function transfer(address payee, uint256 amount) public {
        require(balances[msg.sender] >= amount, "You do not have enough balance to transfer"); // 检查调用者的余额是否足够
        balances[msg.sender] -= amount; // 减少调用者的通证余额
        balances[payee] += amount; // 增加接收者的通证余额
    }

    // balanceOf函数：用于查看指定地址的通证数量
    function balanceOf(address addr) public view returns (uint256) {
        return balances[addr]; // 返回指定地址的通证余额
    }
}