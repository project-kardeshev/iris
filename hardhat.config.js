require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  settings: {
    optimizer: {
      enabled: true,
      runs: 50
    }
  },
  networks: {
    weavevm_testnet: {
      url: "https://testnet-rpc.wvm.dev",
      accounts: [process.env.PRIVATE_KEY] // Replace with your wallet private key for deployment
    }
  }
};