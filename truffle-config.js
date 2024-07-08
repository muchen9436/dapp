const HDWalletProvider = require("@truffle/hdwallet-provider");

const PRIVATE_KEY = "";
const INFURA_PROJECT_ID = "59506713d4a74b1e8e645cf276f13888"; // 替换为你的 Infura 项目 ID

module.exports = {
  networks: {
    development: {
      host: "10.168.2.130",
      port: 8546,
      network_id: "*" // Match any network id
    },
    sepolia: {
      provider: () =>
          new HDWalletProvider(
              PRIVATE_KEY,
              "https://sepolia-eth.w3node.com/570cc328e57fc598afcef0c4001e1d615b513fb092dc1206d150765992c2a74d/api"
              // "https://eth-sepolia.g.alchemy.com/v2/ztUFPI27HH6azOHk5Xu6Z1dqeh22bt60"
              // `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}` // 使用 Infura 的 Sepolia 网络
          ),
      network_id: 11155111, // Sepolia 网络的 id
      gas: 5500000,
      gasPrice: 20000000000, // 调整 gas 价格以确保足够
      confirmations: 2,
      timeoutBlocks: 500,
      skipDryRun: true,
      networkCheckTimeout: 1000000, // 增加连接超时时间
      deploymentPollingInterval: 15000 // 增加部署轮询间隔时间
    }
  },
  compilers: {
    solc: {
      version: "0.8.20" // Fetch exact version from solc-bin
    }
  }
};
