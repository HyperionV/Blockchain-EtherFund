import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy CampaignFactory
  const CampaignFactory = await ethers.getContractFactory("CampaignFactory");
  const factory = await CampaignFactory.deploy();

  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();

  console.log("CampaignFactory deployed to:", factoryAddress);

  // Save deployment addresses
  const network = await ethers.provider.getNetwork();
  const deploymentInfo = {
    factory: factoryAddress,
    network: network.name,
    chainId: network.chainId.toString(),
  };

  console.log("\nDeployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

