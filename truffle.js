module.exports = {
  networks: {
    /**
     *  development configuration is defined to work
     *  with truffle develop
     */
     development: {
      host: "127.0.0.1",    // localhost for tests
      port: 9545,           // truffle develop port
      network_id: "*",      // Match any network id
      gas: 4712388          // Standard gas limit
    }
  }
};
