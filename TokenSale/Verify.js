let batchFilePath = process.argv[2];
let tokenSaleAddress = process.argv[3];
let mnemonicFilePath = process.argv[4];
let infuraAPIKey = process.argv[5];
let ethereumNodeURL = process.argv[6];

let usage = "From git root dir: \n" +
            "node TokenSale/Verify.js batchFilePath TokenSaleAddress MnemonicFilePath InfuraAPIKey\n";

if (tokenSaleAddress == undefined || mnemonicFilePath == undefined || infuraAPIKey == undefined || batchFilePath == undefined)
{
    console.log(usage);
    process.exit(1);
}

const fs = require('fs');
const path = require('path');
const BigNumber = require('bignumber.js')

let batchFileData = [];

try {
    const BATCH_FILE_PATH = path.resolve(batchFilePath);
    batchFileData = fs.readFileSync(BATCH_FILE_PATH).toString().split('\n').filter(x => x);
    console.log("Num accounts = " + batchFileData.length);
} catch (error) {
    console.error("Could not open file at " + batchFilePath + " [" + error + "]");
    process.exit(3);
}

const BTUTokenSale = require('../build/contracts/BTUTokenSale');
const BTU = require('../build/contracts/BTU');

const Web3 = require('web3');
var web3 = new Web3();

if (ethereumNodeURL == undefined) {
    // When using real ethereum account
    var HDWalletProvider = require("truffle-hdwallet-provider");
    const MNEMONIC_FILE_PATH = path.resolve(mnemonicFilePath);
    var mnemonic = fs.readFileSync(MNEMONIC_FILE_PATH);
    mnemonic = mnemonic.toString().replace(/(\r\n\t|\n|\r\t)/gm,"");
    var provider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + infuraAPIKey);

    web3.setProvider(provider);
}
else {
    web3.setProvider(ethereumNodeURL);
}

web3.eth.net.isListening().then(function(res) {
    console.log("IsConnected = " + res);
});


let btuTokenSale = new web3.eth.Contract(BTUTokenSale.abi, tokenSaleAddress);
console.log("BTUTokenSale address = " + tokenSaleAddress);

console.log("Accounts: \n" + batchFileData.join('\n'));
let addresses = [];
let amounts = [];
batchFileData.forEach(function(account) {
    let values = account.split(',').filter(x => x);
    if (values.length == 2) {
        addresses.push(values[0]);
        amounts.push(new BigNumber(values[1]));
    } else {
        console.log("Error parsing batch file !");
        process.exit(4);
    }
});

function getBTUToken() {
    return new Promise(function(resolve, reject) {
        btuTokenSale.methods.btuTokenAddress().call(function(err, res) {
            if (err) return reject(err);
            resolve(res);
        });
    });
}

function verifyAmount(btu, addr, amnt) {
    return new Promise(function(resolve, reject) {
        btu.methods.balanceOf(addr).call(function(err, res) {
            if (err) {
                console.log("Error verifying tokens: " + err);
                return reject(err);
            }
            console.log(res);
            bg = new BigNumber(res);
            if (amnt.toNumber() != res)
            {
                console.log("\033[33mWarning: amount in batch(" + amnt + ") does not equal amount on account (" + bg + ")\033[0m");
            }
            resolve(res);
        });
    });
}

async function verifyAccounts(btu, addrs, amnts) {
    let num = addrs.length;
    for(let i = 0; i < num; ++i) {
        console.log("Address n°" + (i + 1) + " : " + addrs[0]);
        await verifyAmount(btu, addrs.shift(), amnts.shift());
    }
}

web3.eth.getAccounts(function(error, accounts) {
    console.log("Using account: " + accounts[0]);
    let totalAllowance = amounts.reduce((a, b) => a + b, 0);

    getBTUToken().then(function(btuToken) {
        console.log("BTUToken address = " + btuToken);
        let btu = new web3.eth.Contract(BTU.abi, btuToken);
        verifyAccounts(btu, addresses, amounts)

    }, function(err) {
        console.log(err);
    });
});
