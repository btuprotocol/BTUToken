let tokenSaleAddress = process.argv[2];
let mnemonicFilePath = process.argv[3];
let infuraAPIKey = process.argv[4];
let account = process.argv[5];
let ethereumNodeURL = process.argv[6];

let usage = "From git root dir: \n" +
            "node TokenSale/Defrost.js TokenSaleAddress MnemonicFilePath InfuraAPIKey account=[company|founders|bounty]\n";

if (tokenSaleAddress == undefined || mnemonicFilePath == undefined || infuraAPIKey == undefined || account ==undefined)
{
    console.log(usage);
    process.exit(1);
}

const BTUTokenSale = require('../build/contracts/BTUTokenSale');

const fs = require('fs');
const path = require('path');

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

async function defrostCompanyTokens(account) {
    btuTokenSale.methods.defrostCompanyTokens().send({from: account, gasLimit: 500000}, function(err, res) {
        if (err) {
            console.log("Error in tokenSale defrost: " + err);
            return err;
        }
        return res;
    });
}

async function defrostFoundersTokens(account) {
    btuTokenSale.methods.defrostFoundersTokens().send({from: account, gasLimit: 500000}, function(err, res) {
        if (err) {
            console.log("Error in tokenSale defrost: " + err);
            return err;
        }
        return res;
    });
}

async function defrostBountyTokens(account) {
    btuTokenSale.methods.defrostBountyTokens().send({from: account, gasLimit: 500000}, function(err, res) {
        if (err) {
            console.log("Error in tokenSale defrost: " + err);
            return err;
        }
        return res;
    });
}

web3.eth.getAccounts(function(error, accounts) {
    console.log("Using account: " + accounts[0]);
    if (account == "company")
        return defrostCompanyTokens(accounts[0]);
    else if (account =="founders")
        return defrostFoundersTokens(accounts[0]);
    else if (account == "bounty")
        return defrostBountyTokens(accounts[0]);
});
