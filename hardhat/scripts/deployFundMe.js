// import ethers.js
// create main function
// execute main function

const { ethers } = require("hardhat");

async function main() {
    // create factory
    const FundMeFactory = await ethers.getContractFactory("FundMe");
    console.log("Deploying FundMe contract...");
    // deploy contract from factory
    const fundMe = await FundMeFactory.deploy(10);
    await fundMe.waitForDeployment();
    // print contract address
    console.log("Contract deployed to:", fundMe.target);

    // verify fundMe
    if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
        // if the chain is sepolia and ETHERSCAN_API_KEY is set, verify contract
        console.log("waiting for deployment to finish...");
        await fundMe.deploymentTransaction().wait(5);

        await verifyFundMe(fundMe.target, [10]);
    } else {
        console.log("Skipping contract verification...");
    }
}

async function verifyFundMe(fundMeAddr, args) {
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args,
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })

// 1.24.37