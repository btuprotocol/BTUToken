const BTU = artifacts.require('./BTU.sol');
const RES = artifacts.require('./RES.sol');

// Publish test data exemple (change date to unix timestamp)
// 1,10,1,1520890467446,1520890467446,1520890477445,"metadata"
contract('RES UnitTest', function(accounts) {

    let aType = 1;
    let minDeposit = 10;
    let commission = 1;
    let startDate = Date.now();
    let endDate = Date.now() + 1000 * 3600 * 24;
    it("sould publish an availability", function() {
        return RES.deployed().then(async(instance) => {

            // Publish an availability and test that the number of availabilities has been incremented
            await instance.publishAvailability(aType, minDeposit, commission, startDate, startDate, endDate, "metadata", {from: accounts[0]});
            let availabilityNumber = await instance.getAvailabilityNumber.call();
            assert.equal(availabilityNumber.toNumber(), 1, "There should be 1 availability");

            let availability = await instance.getAvailability.call(availabilityNumber - 1);
            assert.equal(availability[0], accounts[0], "provider should be accounts[0]");
            assert.equal(availability[1].toNumber(), aType, "aType should be " + aType);
            assert.equal(availability[2].toNumber(), minDeposit, "minDeposit should be " + minDeposit);
            assert.equal(availability[3].toNumber(), commission, "commission should be " + commission);
            assert.equal(availability[4].toNumber(), startDate, "freeCancelDateTs should be " + startDate);
            assert.equal(availability[5].toNumber(), startDate, "startDateTs should be " + startDate);
            assert.equal(availability[6].toNumber(), endDate, "endDateTs should be " + endDate);
            assert.equal(availability[7].toNumber(), 0, "availabilityStatus should be NONE(0)");
            assert.equal(availability[8].toString(), "metadata", "metaDataLink should be 'metadata'");
        });
    });

    it("sould reserve an availability", function() {
        return BTU.deployed().then(async(btuInstance) => {
            return RES.deployed().then(async(resInstance) => {

                // Transfer some BTUs to accounts[1]
                await btuInstance.transfer(accounts[1], 100, {from: accounts[0]});

                await btuInstance.approve(RES.address, 10, {from: accounts[1]});
                await resInstance.requestReservation(0, {from: accounts[1]});
                let resBalance = await btuInstance.balanceOf.call(RES.address);
                assert.equal(resBalance.toNumber(), 10, "balance of the RES contract should be 10");
                let reservationStatus = await resInstance.getReservationStatus.call(0);
                assert.equal(reservationStatus.toNumber(), 1, "Availability should be REQUESTED(1)");
            });
        });
    });

    it("sould accept a reservation", function() {
        return RES.deployed().then(async(resInstance) => {

            await resInstance.acceptReservation(0, {from: accounts[0]});
            let reservationStatus = await resInstance.getReservationStatus.call(0);
            assert.equal(reservationStatus.toNumber(), 2, "Availability should be CONFIRMED(3)");
        });
    });

    it("sould complete a transaction", function() {
        return BTU.deployed().then(async(btuInstance) => {
            return RES.deployed().then(async(resInstance) => {

                await resInstance.completeTransaction(0, {from: accounts[0]});
                let reservationStatus = await resInstance.getReservationStatus.call(0);
                assert.equal(reservationStatus.toNumber(), 0, "Availability should be AVAILABLE(0)");
                let bookerBalance = await btuInstance.balanceOf.call(accounts[1]);
                // Minus commission when implemented
                assert.equal(bookerBalance.toNumber(), 100, "Booker should get back its deposit");
            });
        });
    });

    it("sould reject a transaction", function() {
        return BTU.deployed().then(async(btuInstance) => {
            return RES.deployed().then(async(resInstance) => {

                // Publish a new availability as the previous one was completed
                await resInstance.publishAvailability(aType, minDeposit, commission, startDate, startDate, endDate, "metadata", {from: accounts[0]});
                let availabilityNumber = await resInstance.getAvailabilityNumber.call();
                --availabilityNumber; // Use index instead of number

                // Give accounts[2] some BTUs
                await btuInstance.transfer(accounts[2], 100, {from: accounts[0]});

                // Request the last availability
                await btuInstance.approve(RES.address, 10, {from: accounts[2]});
                await resInstance.requestReservation(availabilityNumber, {from: accounts[2]});

                await resInstance.rejectTransaction(availabilityNumber, {from: accounts[0]});
                let reservationStatus = await resInstance.getReservationStatus.call(0);
                assert.equal(reservationStatus.toNumber(), 0, "Availability should be AVAILABLE(0)");
            });
        });
    });
});
