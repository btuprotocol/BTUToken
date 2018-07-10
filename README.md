# BTU Token

The BTU Token is the ERC-20 token smart contract token to be used in conjonction with the ERC-808 smart contract in order to make reservations over the BTU Protocol.
A token sale contract (BTUTokenSale) is also present in this repository, it is complemented by scripts to assign tokens when the BTUToken is released.

# BTU Token mainnet and wallet information 
    - BTU Token adress : 0xb683D83a532e2Cb7DFa5275eED3698436371cc9f 
    - Symbol                    : BTU
    - Decimal                   : 18
    
The BTU Token is the ERC-20 token smart contract token to be used in conjonction with the ERC-808 smart contract in order to make 
## Smart contracts
 ### BTUToken
 Implemented using zeppelin's framework, the `BookingTokenUnit` is an ERC-20 capped token. The cap is defined by the initial supply which is 100M tokens. The symbol for the token is `BTU` and it has 18 decimals.

 ### BTUTokenSale
 The token sale contract will deploy the BTUToken and be able to assign tokens to investors when the release date is reached.

## Technical part  

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
