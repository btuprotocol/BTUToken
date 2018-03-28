// Setup variables such as the ethereumNodeURL and the batch file
let batchFilePath = process.argv[2];
let tokenSaleAddress = process.argv[3];
let btuAddress = process.argv[4];
let ethereumNodeURL = process.argv[5];

if (ethereumNodeURL == undefined) {
    ethereumNodeURL = 'http://localhost:9545';
}

if (tokenSaleAddress == undefined) {
    console.log('This script needs the BTUTokenSale contract address !');
    process.exit(1);
}

if (btuAddress == undefined) {
    console.log('This script needs the BTUToken contract address !');
    process.exit(2);
}

if (batchFilePath == undefined) {
    console.log('This script needs a batch file to assign token to addresses !');
    process.exit(3);
}

const fs = require('fs');
const path = require('path');

let batchFileData = [];

try {
    const BATCH_FILE_PATH = path.resolve(batchFilePath);
    batchFileData = fs.readFileSync(BATCH_FILE_PATH).toString().split('\n').filter(x => x);
    console.log("Num accounts = " + batchFileData.length);
} catch (error) {
    console.error("Could not open file at " + batchFilePath + " [" + error + "]");
    process.exit(4);
}

const BTUTokenSale = require('../build/contracts/BTUTokenSale.json');
const BTU = require('../build/contracts/BTU.json');
const Web3 = require('web3');
web3 = new Web3(new Web3.providers.HttpProvider(ethereumNodeURL));

let btuTokenSale = new web3.eth.Contract(BTUTokenSale.abi, tokenSaleAddress);
let btuToken = new web3.eth.Contract(BTU.abi, btuAddress);
console.log("BTUTokenSale address = " + BTUTokenSale.address);
console.log("BTU address = " + BTU.address);

let addresses = [];
let amounts = [];
batchFileData.forEach(function(account) {
    let values = account.split(',').filter(x => x);
    if (values.length == 2) {
        addresses.push(values[0]);
        amounts.push(parseInt(values[1]));
    } else {
        console.log("Error parsing batch file !");
        process.exit(5);
    }
});

console.log("Accounts addresses: \n" + addresses.join('\n'));
console.log("Accounts amounts: \n" + amounts.join('\n'));

/* // When using real ethereum account
console.log("Unlocking account ...");
try {
    web3.personal.unlockAccount(web3.eth.accounts[0], password);
} catch(e) {
    console.log(e);
    return;
}
console.log("Unlock OK");
*/

//web3.eth.defaultAccount = web3.eth.accounts[0];

function approveTransfer(account, amount) {
    return new Promise(function(resolve, reject) {
        btuToken.methods.approve(tokenSaleAddress, amount).send({from: account}, function(err, res) {
            if (err) return reject(err);
            resolve(res);
        });
    });
}

web3.eth.getAccounts(function(error, accounts) {
    console.log("Using account: " + accounts[0]);
    let totalAllowance = amounts.reduce((a, b) => a + b, 0);

    /*btuTokenSale.methods.btuToken().call(function(err, res) {
        console.log("Token: " + res);
    });*/

    approveTransfer(accounts[0], totalAllowance).then(function() {
        btuToken.methods.balanceOf(accounts[0]).call(function(error, result) {
            console.log("balance = " + result);
        });

        btuToken.methods.allowance(accounts[0], tokenSaleAddress).call(function(error, result) {
            console.log("allowance = " + result);
        });

        btuTokenSale.methods.assignTokens(addresses, amounts).send({from: accounts[0]}, function(err, res) {
            if (err) {
                console.log("Error assigning tokens: " + err);
                return err;
            }
            btuToken.methods.balanceOf(addresses[1]).call(function(error, result) {
                console.log(result);
                //console.log("Balance = " + balance.toNumber());
            });
            console.log("done");
        });
    }, function(err) {
        console.log(err);
    });
}); //web3.eth.accounts[0];

//btuTokenSale.setBTUToken(BTU.address, {from: ownerAccount, gas: 120000});
/*// Get the estimated gas used by the transaction
let estimatedGas = btuTokenSale.assignTokens.estimateGas(addresses, amounts, {from: web3.eth.accounts[0]});
console.log("Estimated gas = " + estimatedGas);*/
/* get the last block gaslimit
gasLimit = web3.eth.getBlock("latest").gasLimit;
console.log("gasLimit = " + gasLimit);*/
