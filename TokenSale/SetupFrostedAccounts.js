let companyAddress = "0x6148311D9ad93c9299AE03Ac35104194ebEeD600";
let foundersAddress = "0x3cA081445e02eA6d8E5645Bb68Be8C4493700Dad";
let bountyAddress = "0xE2339a32b2E14C484217A50080fb13766C6F73c1";

let tokenSaleAddress = process.argv[2];
let mnemonicFilePath = process.argv[3];
let infuraAPIKey = process.argv[4];
let ethereumNodeURL = process.argv[5];

let usage = "From git root dir: \n" +
            "node TokenSale/SetupFrostedAccounts.js TokenSaleAddress MnemonicFilePath InfuraAPIKey\n";

if (tokenSaleAddress == undefined || mnemonicFilePath == undefined || infuraAPIKey == undefined)
{
    console.log(usage);
    process.exit(1);
}

const fs = require('fs');
const path = require('path');

const BTUTokenSale = require('../build/contracts/BTUTokenSale');
const BTU = require('../build/contracts/BTU');

const Web3 = require('web3');
var web3 = new Web3();

if (ethereumNodeURL == undefined) {
    console.log("Using ropsten");
    // When using real ethereum account
    var HDWalletProvider = require("truffle-hdwallet-provider");
    const MNEMONIC_FILE_PATH = path.resolve(mnemonicFilePath);
    var mnemonic = fs.readFileSync(MNEMONIC_FILE_PATH);
    console.log("APIKey = " + infuraAPIKey);
    mnemonic = mnemonic.toString().replace(/(\r\n\t|\n|\r\t)/gm,"");
    console.log("mnemonic = " + mnemonic);
    var provider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + infuraAPIKey);
    web3.setProvider(provider);
}
else {
    console.log("Using " + ethereumNodeURL);
    web3.setProvider(ethereumNodeURL);
}

let btuTokenSale = new web3.eth.Contract(BTUTokenSale.abi, tokenSaleAddress);
console.log("BTUTokenSale address = " + tokenSaleAddress);

web3.eth.net.isListening().then(function(res) {
    console.log("IsConnected = " + res);
});

async function setup(account) {
    btuTokenSale.methods.setupFrostedAccounts(companyAddress, foundersAddress, bountyAddress).estimateGas({from: account}).then(function(estimatedGas) {
        console.log("Estimated gas = " + estimatedGas);
        // Add 10% to the gas limit
        let gasLimit = estimatedGas + Math.ceil(10 * estimatedGas / 100);
        btuTokenSale.methods.setupFrostedAccounts(companyAddress, foundersAddress, bountyAddress).send({from: account, gas: gasLimit}, function(err, res) {
            if (err) {
                console.log("Error in tokenSale setup: " + err);
                return err;
            }
            return res;
        });
    });
}

web3.eth.getAccounts(function(error, accounts) {
    console.log("Using account: " + accounts[0]);
    setup(accounts[0]);
});
