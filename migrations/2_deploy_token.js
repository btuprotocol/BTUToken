const BTUToken = artifacts.require('./BTU.sol');
const BTUTokenSale = artifacts.require('./BTUTokenSale.sol');

module.exports = function(deployer) {
    deployer.deploy(BTUTokenSale);
};
