// import ethers.js
// create main function
    // init 2 accounts
    // fund contract with first account
    // check balance of contract
    // fund contract with second account
    // check balance of contract
    // check mapping fundersToAmount
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

    // init 2 accounts
    const [firstAccount, secondAccount] = await ethers.getSigners();

    // fund contract with first account
    const fundTx = await fundMe.fund({value: ethers.parseEther("0.5")})
    await fundTx.wait();

    // check balance of contract
    const balanceOfContract = await ethers.provider.getBalance(fundMe.target);
    console.log("Balance of contract:", balanceOfContract);

    // fund contract with second account
    const fundTxWithSecondAccount = await fundMe.connect(secondAccount).fund({value: ethers.parseEther("0.5")})
    await fundTxWithSecondAccount.wait();

    // check balance of contract
    const balanceOfContractAfterSecondFund = await ethers.provider.getBalance(fundMe.target);
    console.log("Balance of contract:", balanceOfContractAfterSecondFund);

    // check mapping fundersToAmount
    const firstAccountBalanceInFundMe = await fundMe.fundersToAmount(firstAccount.address);
    const secondAccountBalanceInFundMe = await fundMe.fundersToAmount(secondAccount.address);
    console.log("Balance of first account " + firstAccount.address + " in FundMe:", firstAccountBalanceInFundMe);
    console.log("Balance of second account " + secondAccount.address + " in FundMe:", secondAccountBalanceInFundMe);
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