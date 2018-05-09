var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "impact stay fish oil hover solar excess monster output fence razor celery";

module.exports = {
  networks: {
    /**
     *  development configuration is defined to work
     *  with truffle develop
     */
    localhost: {
      host: "localhost",    // localhost for tests
      port: 9545,           // truffle develop port
      network_id: "*",      // Match any network id
      gas: 4700000          // Standard gas limit
    },
    metamask: {
        provider: function() {
            return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/DYBja4A1RKCdnSP4DMYt");
        },
        port: 443,
        network_id: "3",
        gas: 4700000          // Standard gas limit
    },
    mainnet: {
        provider: function() {
            return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/DYBja4A1RKCdnSP4DMYt");
        },
        port: 443,
        network_id: "1",
        gas: 4700000          // Standard gas limit
    }
  }
};
