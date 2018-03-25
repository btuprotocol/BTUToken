const BTUToken = artifacts.require('./BTU.sol');
const BTUTokenSale = artifacts.require('./BTUTokenSale.sol');

module.exports = function(deployer, network, accounts) {
    deployer.deploy(BTUToken).then(function() {
        deployer.deploy(BTUTokenSale, BTUToken.address,
                                      accounts[0],
                                      accounts[1],
                                      accounts[2]);
    });
};
