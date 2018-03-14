const BTU = artifacts.require('./BTU.sol');

/**
 * First accounts[0] possess all the BTU as the contract deployer
 * Then it sends 10 BTU to accounts[1]
 */
contract('BTU UnitTest', function(accounts) {
    it("should transfer BTU", function() {
        return BTU.deployed().then(async(instance) => {
            let balance = await instance.balanceOf.call(accounts[1]);
            let amount = 10;
            assert.equal(balance.toNumber(), 0, "account[0] sould not have BTU");
            await instance.transfer(accounts[1], amount, {from: accounts[0]});
            balance = await instance.balanceOf.call(accounts[1]);
            assert.equal(balance.toNumber(), amount, "account[0] sould have " + amount + "BTU");
        });
    });
});
