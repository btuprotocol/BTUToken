# BTU Token

The BTU Token is the ERC-20 token smart contract token to be used in conjonction with the ERC-808 smart contract in order to make reservations over the BTU Protocol.
A token sale contract (BTUTokenSale) is also present in this repository, it is complemented by scripts to assign tokens when the BTUToken is released.

# BTU Token on Ethereum Mainnet, Ethereum Goerli & Ethereum Rinkeby 
    - BTU Token address: 0xb683D83a532e2Cb7DFa5275eED3698436371cc9f 
    - Symbol           : BTU
    - Decimals         : 18
    - Logo             : https://btu-protocol.com/assets/0xb683D83a532e2Cb7DFa5275eED3698436371cc9f/logo.png

# BTU Token on Polygon Network (ex-Matic Mainnet)
    - BTU Token address: 0xfdc26cda2d2440d0e83cd1dee8e8be48405806dc 
    - Symbol           : BTU
    - Decimals         : 18

# BTU Token on Ethereum Ropsten
    - BTU Token address: 0xfcd404ec70c662128d3a6bd508dfb3e598d79a0c 
    - Symbol           : BTU
    - Decimals         : 18

# BTU Token on Ethereum Kovan
    - BTU Token address: 0x3010eC3c9b6FAfAd1DaAbABEDA87327E34593002 
    - Symbol           : BTU
    - Decimals         : 18

# BTU Token on Polygon Mumbai (ex-Matic Mumbai)
    - BTU Token address: 0xFf0E710e9AcB1e445b4eD28E05BA26ffBD6a558b 
    - Symbol           : BTU
    - Decimals         : 18


The BTU token is the ERC-20 token smart contract meant to be used in conjonction with the ERC-808 smart contract. 
## Smart contracts
 ### BTUToken
 Implemented using zeppelin's framework, the `BookingTokenUnit` is an ERC-20 capped token. The cap is defined by the initial supply which is 100M tokens. The symbol for the token is `BTU` and it has 18 decimals.

 ### BTUTokenSale
 The token sale contract will deploy the BTUToken and be able to assign tokens to investors when the release date is reached.

## Script usage  

**General requirements  :**

    -   Node.js server v8 or higher (build with v9.8.0) https://nodejs.org/en/download/
    -   Truffle v4.0.6 (npm install -g truffle)

**Install dependencies  :**

    -   npm install

**Setup your account**

    In `truffle.js` :
    -   Change the mnemonic to yours
    -   Change the infura API key if you are using ropsten

**Run the context in local :**

    -   truffle develop
    -   migrate

**Run the context on ropsten :**

    - truffle --network metamask migrate

**Run tests :**

    -   truffle test
    (Note that you must have started the context and migrated the contract in order to run the test)
