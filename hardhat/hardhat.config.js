require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config();

const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

// 加入系统代理，以确保能快速连接上sepolia测试网
const { ProxyAgent, setGlobalDispatcher } = require("undici");
const proxyAgent = new ProxyAgent("http://127.0.0.1:7890");
setGlobalDispatcher(proxyAgent);


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: SEPOLIA_URL, // Alchemy, Infura, QuickNode
      accounts: [PRIVATE_KEY],
      chainId: 11155111, // Sepolia chainId (searched on chainlist.org)
    }
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY
    }
  }
};
