require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config();

const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: SEPOLIA_URL, // Alchemy, Infura, QuickNode
      accounts: [PRIVATE_KEY]
    }
  }
};
