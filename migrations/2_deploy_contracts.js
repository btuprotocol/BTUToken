const BTU = artifacts.require('./BTU.sol');
const RES = artifacts.require('./RES.sol');

module.exports = function(deployer) {
    deployer.deploy(BTU).then(function() {
        return deployer.deploy(RES, BTU.address);
    });
};
