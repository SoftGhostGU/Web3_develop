const { DECIMAL, INITIAL_ANSWER, developmentChains } = require('../helper-hardhat-config')

module.exports = async({getNamedAccounts, deployments}) => {
    if (developmentChains.includes(network.name)) {
        const firstAccount = (await getNamedAccounts()).firstAccount; // 获取命名账户
        const deploy = deployments.deploy; // 部署合约
        
        await deploy("MockV3Aggregator", {
            from: firstAccount,
            args: [DECIMAL, INITIAL_ANSWER],
            log: true
        })
    } else {
        console.log("Environment is not local, mock contract deployment is skipped...")
    }
    
}

module.exports.tags = ["All", "mock"] // 标签