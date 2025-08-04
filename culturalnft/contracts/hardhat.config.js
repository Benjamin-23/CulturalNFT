require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    "hedera-testnet": {
      url: "https://testnet.hashio.io/api",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 296,
      gas: 3000000,
      // gasPrice: 10000000000, // 10 gwei
    },
    "hedera-mainnet": {
      url: "https://mainnet.hashio.io/api",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 295,
      gas: 3000000,
      gasPrice: 10000000000, // 10 gwei
    },
    hardhat: {
      chainId: 1337,
    },
  },
  etherscan: {
    apiKey: {
      "hedera-testnet": "test",
      "hedera-mainnet": "test",
    },
    customChains: [
      {
        network: "hedera-testnet",
        chainId: 296,
        urls: {
          apiURL: "https://server-verify.hashscan.io",
          browserURL: "https://hashscan.io/testnet",
        },
      },
      {
        network: "hedera-mainnet",
        chainId: 295,
        urls: {
          apiURL: "https://server-verify.hashscan.io",
          browserURL: "https://hashscan.io/mainnet",
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
