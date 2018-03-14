pragma solidity ^0.4.0;

import "zeppelin-solidity/contracts/token/ERC20/CappedToken.sol";
/**
 * The address which deployed the BTU contract can tranfer the INITIAL_FUNDS
 * by using the ERC20's funtion tranfer(address to, uint256 amount).
 * BTUs may be distributed by an initial sale.
 */

/**
 * CappedToken implement ERC20 and ERC20Basic interfaces
 * throught BasicToken and StandardToken contracts
 * Completed by MintableToken contract wich allow to change totalSupply amount
 * CappedToken allows to limit maximum amount of tokens
 * CappedToken is ownable. It mean that the address of the contract initial caller
 * is set to a variable called owner. This ownership can be transferred.
 * We can use a modifier called 'onlyOwner' after public keyword to allow
 * an action only for the owner.
 */
contract BTU is CappedToken(100000000 * 10 ** 18) {
    string public name = "BookingTokenUnit";
    string public symbol = "BTU";
    uint8 public decimals = 18;
    uint public INITIAL_SUPPLY = 100000000 * 10 ** 18;

    /**
     * On construction, the owner balance is set with
     * the INITIAL_FUNDS amount.
     * Distribution of BTUs can be done from the owner address.
     */
    function BTU() public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
    }

    function getOwner() public view returns(address) {
        return owner;
    }
}
