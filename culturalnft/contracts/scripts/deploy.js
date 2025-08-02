const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment to Hedera network...");

  const [deployer] = await ethers.getSigners();
  console.log(
    "📝 Deploying contracts with account:",
    await deployer.getAddress(),
  );

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "HBAR");

  // Community wallet address (replace with actual address)
  const communityWallet =
    process.env.COMMUNITY_WALLET || (await deployer.getAddress());
  console.log("🏛️ Community wallet:", communityWallet);

  // Deploy CulturalNFT contract
  console.log("\n📦 Deploying CulturalNFT contract...");
  const CulturalNFT = await ethers.getContractFactory("CulturalNFT");
  const culturalNFT = await CulturalNFT.deploy(communityWallet);
  await culturalNFT.waitForDeployment();
  const culturalNFTAddress = await culturalNFT.getAddress();
  console.log("✅ CulturalNFT deployed to:", culturalNFTAddress);

  // Deploy CulturalMarketplace contract
  console.log("\n📦 Deploying CulturalMarketplace contract...");
  const CulturalMarketplace = await ethers.getContractFactory(
    "CulturalMarketplace",
  );
  const marketplace = await CulturalMarketplace.deploy(
    culturalNFTAddress,
    communityWallet,
  );
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ CulturalMarketplace deployed to:", marketplaceAddress);

  // Deploy CommunityRewards contract
  console.log("\n📦 Deploying CommunityRewards contract...");
  const CommunityRewards = await ethers.getContractFactory("CommunityRewards");
  const rewards = await CommunityRewards.deploy(culturalNFTAddress);
  await rewards.waitForDeployment();
  const rewardsAddress = await rewards.getAddress();
  console.log("✅ CommunityRewards deployed to:", rewardsAddress);

  // Save deployment addresses
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: await deployer.getAddress(),
    communityWallet: communityWallet,
    contracts: {
      CulturalNFT: culturalNFTAddress,
      CulturalMarketplace: marketplaceAddress,
      CommunityRewards: rewardsAddress,
    },
    deploymentTime: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info
  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("📄 Deployment info saved to:", deploymentFile);

  // Generate frontend config
  const frontendConfig = {
    NEXT_PUBLIC_CULTURAL_NFT_ADDRESS: culturalNFTAddress,
    NEXT_PUBLIC_MARKETPLACE_ADDRESS: marketplaceAddress,
    NEXT_PUBLIC_REWARDS_ADDRESS: rewardsAddress,
    NEXT_PUBLIC_COMMUNITY_WALLET: communityWallet,
    NEXT_PUBLIC_NETWORK_NAME: hre.network.name,
    NEXT_PUBLIC_CHAIN_ID: hre.network.config.chainId,
  };

  const envFile = path.join(__dirname, "../../.env.local");
  let envContent = "";

  // Read existing .env.local if it exists
  if (fs.existsSync(envFile)) {
    envContent = fs.readFileSync(envFile, "utf8");
  }

  // Update or add contract addresses
  Object.entries(frontendConfig).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, "m");
    const line = `${key}=${value}`;

    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, line);
    } else {
      envContent += `\n${line}`;
    }
  });

  fs.writeFileSync(envFile, envContent.trim() + "\n");
  console.log("🔧 Frontend config updated in .env.local");

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("   CulturalNFT:", culturalNFTAddress);
  console.log("   CulturalMarketplace:", marketplaceAddress);
  console.log("   CommunityRewards:", rewardsAddress);

  console.log("\n🔗 Verification commands:");
  console.log(
    `   npx hardhat verify --network ${hre.network.name} ${culturalNFTAddress} "${communityWallet}"`,
  );
  console.log(
    `   npx hardhat verify --network ${hre.network.name} ${marketplaceAddress} "${culturalNFTAddress}" "${communityWallet}"`,
  );
  console.log(
    `   npx hardhat verify --network ${hre.network.name} ${rewardsAddress} "${culturalNFTAddress}"`,
  );

  console.log("\n⚠️  Next steps:");
  console.log("   1. Verify contracts on HashScan");
  console.log("   2. Update frontend with new contract addresses");
  console.log("   3. Test all contract functions");
  console.log("   4. Set up proper community wallet");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
