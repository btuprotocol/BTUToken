pragma solidity ^0.4.0;

import "./BTU.sol";

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

/* This contract is usable by the BTU's owner only unless ownership is transferred.
 * In that case the owner of the BTU has to approve every transfer.
 */
contract BTUTokenSale is Ownable {
    // uint256 public constant ICO_START_DATE = 1524009600; // 18/04/2018 00:00 Start date to be uncommented when deployed
    uint256 public SALE_START_DATE = now; // For tests only

    uint public constant FROST_COMPANY_FACTOR = 20;  // 20% reserved for the company
    uint public constant FROST_FOUNDERS_FACTOR = 20; // 20% reserved for the founders
    uint public constant FROST_BOUNTY_FACTOR = 10;   // 10% reserved for bounty

    uint public constant FROSTED_COMPANY_LOCKUP = 2;    // 2 years lockup
    uint public constant FROSTED_FOUNDERS_LOCKUP = 1;   // 1 year lockup

    // Address of the company reserve
    address private companyAddress;
    // Amount reserved
    uint256 public companyReserved;
    // Already defrosted
    bool public companyReservedDefrosted;

    // Address of the founders reserve
    address private foundersAddress;
    // Amount reserved
    uint256 public foundersReserved;
    // Already defrosted
    bool public foundersReservedDefrosted;

    // Address of the bounty reserve
    address private bountyAddress;
    // Amount reserved
    uint256 public bountyReserved;
    // Already defrosted
    bool public bountyReservedDefrosted;

    // Number of assigned tokens to date
    uint256 public assignedTokens;

    // Address of BTUToken smart contract
    address public btuToken;

    // Construtor
    function BTUTokenSale() public {
        owner = msg.sender;
        btuToken = new BTU();
        companyReservedDefrosted = false;
        foundersReservedDefrosted = false;
        bountyReservedDefrosted = false;
    }

    /* Assignment of tokens has to be done by the owner of the BTUToken
     * It is done in batches of addreses with corresponding amounts
     * For the transfer to work the owner has to approve the transfer for each address first
     */
    function assignTokens(address[] _batchAddr, uint[] _batchAmount) public onlyOwner {
        // Verify that the array of amounts has the same length as the array of addresses to send it to
        require(_batchAddr.length == _batchAmount.length);
        // Verify that the sale has started
        require(now > SALE_START_DATE);

        for (uint i = 0; i < _batchAddr.length; ++i) {
            uint amount = _batchAmount[i];
            assignedTokens = SafeMath.add(assignedTokens, amount);
            BTU(btuToken).transfer(_batchAddr[i], amount);
        }
    }

    /* Sets the frosted account for the company, the founders and the bounty */
    function setupFrostedAccounts(address _companyAddress,
                                  address _foundersAddress,
                                  address _bountyAddress) public onlyOwner {
        companyAddress = _companyAddress;
        foundersAddress = _foundersAddress;
        bountyAddress = _bountyAddress;
        // Reserve the frosted tokens
        uint256 initialSupply = BTU(btuToken).totalSupply();
        companyReserved = SafeMath.div(SafeMath.mul(initialSupply, FROST_COMPANY_FACTOR), 100);
        foundersReserved = SafeMath.div(SafeMath.mul(initialSupply, FROST_FOUNDERS_FACTOR), 100);
        bountyReserved = SafeMath.div(SafeMath.mul(initialSupply, FROST_BOUNTY_FACTOR), 100);
        // Keep track of the number of assigned tokens
        assignedTokens = SafeMath.add(companyReserved, foundersReserved);
        assignedTokens = SafeMath.add(assignedTokens, bountyReserved);
    }

    // Frost period for the frosted company tokens
    function defrostCompanyDate() internal view returns(uint256){
        return SALE_START_DATE + FROSTED_COMPANY_LOCKUP * 1 minutes;
    }

    // Defrost company reserved tokens
    function defrostCompanyTokens() public onlyOwner {
        require(companyReservedDefrosted == false);
        require(now > defrostCompanyDate());
        BTU(btuToken).transfer(companyAddress, companyReserved);
        companyReservedDefrosted = true;
    }

    // Frost period for the frosted founders tokens
    function defrostFoundersDate() internal view returns(uint256){
        return SALE_START_DATE + FROSTED_FOUNDERS_LOCKUP * 1 years;
    }

    // Defrost founders reserved tokens (only usable after the frost period is over)
    function defrostFoundersTokens() public onlyOwner {
        require(foundersReservedDefrosted == false);
        require(now > defrostFoundersDate());
        BTU(btuToken).transfer(foundersAddress, foundersReserved);
        foundersReservedDefrosted = true;
    }

    // No frost period for the bounty, the owner can defrost at will
    function defrostBountyTokens() public onlyOwner {
        require(bountyReservedDefrosted == false);
        BTU(btuToken).transfer(bountyAddress, bountyReserved);
        bountyReservedDefrosted = true;
    }

    // Selfdestruct this contract
    function destructContract() public onlyOwner {
        selfdestruct(owner);
    }
}
