# BTU Token

The BTU Token is the ERC-20 token smart contract token to be used in conjonction with the ERC-808 smart contract in order to make reservations over the BTU Protocol.
A token sale contract (BTUTokenSale) is also present in this repository, it will be complemented by scripts to assign tokens when the BTUToken is released

## Smart contracts
 ### BTUToken
 Implemented using zeppelin's framework, the `BookingTokenUnit` is an ERC-20 capped token. The cap is defined by the initial supply which is 100M tokens. The symbol for the token is `BTU` and it has 18 decimals.

 ### BTUTokenSale
 The token sale contract will allow the owner of the BTUToken to assign tokens to investors when the release date is reached.

## Technical part  

**General requirements  :**

    -   Node.js server v8 or higher (build with v9.8.0) https://nodejs.org/en/download/
    -   Truffle v4.0.6 (npm install -g truffle)

**Install dependencies  :**

    -   npm install

**Run the context :**

    -   truffle develop
    -   migrate

**Run tests :**

    -   truffle test
    (Note that you must have started the context and migrated the contract in order to run the test)
