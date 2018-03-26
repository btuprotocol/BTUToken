const BTUToken = artifacts.require('./BTU.sol');
const BTUTokenSale = artifacts.require('./BTUTokenSale.sol');

module.exports = function(deployer) {
    deployer.deploy(BTUToken).then(function() {
        return deployer.deploy(BTUTokenSale, BTUToken.address)
    });
};
