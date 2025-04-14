// function deployFunction() {
//     console.log("This is the deploy function")
// }
// module.exports.default = deployFunction



// module.exports = async(hre) => {
//     const getNamedAccounts = hre.ethers.getNamedAccounts; // 用于获取命名账户
//     const deployments = hre.deployments; // 用于管理部署合约
//     console.log("This is the deploy function")
// }

const { developmentChains, LOCK_TIME, CONFIRMATIONS, networkConfig } = require("../helper-hardhat-config");

module.exports = async({getNamedAccounts, deployments}) => {
    const firstAccount = (await getNamedAccounts()).firstAccount; // 获取命名账户
    const deploy = deployments.deploy; // 部署合约

    let dataFeedAddr
    if (developmentChains.includes(network.name)) { // 本地运行
        const MockV3Aggregator = await deployments.get("MockV3Aggregator")
        dataFeedAddr = MockV3Aggregator.address
    } else {
        dataFeedAddr = networkConfig[network.config.chainId].ethUsdDataFeed
    }
    

    const fundMe = await deploy("FundMe", {
        from: firstAccount,
        args: [LOCK_TIME, dataFeedAddr],
        log: true,
        waitConfirmations: CONFIRMATIONS
    })
    // remove deployment direcvtory or add --reset if you want to redeploy the contract

    if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
        await hre.run("verify:verify", {
            address: fundMe.address,
            constructorArguments: [LOCK_TIME, dataFeedAddr],
        });
    } else {
        console.log("Network is not sepolia, verification skipped...")
    }
}

module.exports.tags = ["All", "FundMe"] // 标签