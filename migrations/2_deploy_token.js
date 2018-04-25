const BTUToken = artifacts.require('./BTU.sol');
const BTUTokenSale = artifacts.require('./BTUTokenSale.sol');

module.exports = function(deployer, network, accounts) {
    console.log(accounts[0]);
    deployer.deploy(BTUTokenSale);
};
