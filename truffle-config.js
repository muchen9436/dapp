module.exports = {
  networks: {
    development: {
      host: "10.168.2.130",
      port: 8546,
      network_id: "*" // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "0.8.20" // Fetch exact version from solc-bin
    }
  }
};
