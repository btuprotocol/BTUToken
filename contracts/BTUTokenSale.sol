pragma solidity ^0.4.21;

import "./BTU.sol";

/* This contract is usable by the BTU's owner only unless ownership is transferred.
 * In that case the owner of the BTU has to approve every transfer.
 * The BTUTokenSale owns the BTU as it creates it when constructed.
 * Composition is used to call the BTU standard ERC20 functions from this contract.
 */
contract BTUTokenSale is Ownable {

    using SafeMath for uint256;

    // uint256 public constant ICO_START_DATE = 1524009600; // 18/04/2018 00:00 GMT Start date to be uncommented when deployed
    uint256 public SALE_START_DATE = now; // For tests only

    uint public constant FROST_COMPANY_FACTOR = 20;  // 20% reserved for the company
    uint public constant FROST_FOUNDERS_FACTOR = 20; // 20% reserved for the founders
    uint public constant FROST_BOUNTY_FACTOR = 10;   // 10% reserved for bounty

    uint public constant FROSTED_COMPANY_LOCKUP = 2;    // 2 years lockup
    uint public constant FROSTED_FOUNDERS_LOCKUP = 1;   // 1 year lockup

    /**
     * Company reserved specific fields
     */
    // Address of the company reserve
    address public companyAddress;
    // Amount reserved
    uint256 public companyReserved;
    // Already defrosted
    bool public companyReservedDefrosted;

    /**
     * Founders reserved specific fields
     */
    // Address of the founders reserve
    address public foundersAddress;
    // Amount reserved
    uint256 public foundersReserved;
    // Already defrosted
    bool public foundersReservedDefrosted;

    /**
     * Bounty reserved specific fields
     */
    // Address of the bounty reserve
    address public bountyAddress;
    // Amount reserved
    uint256 public bountyReserved;
    // Already defrosted
    bool public bountyReservedDefrosted;

    // Number of assigned tokens to date
    uint256 public assignedTokens;

    /**
     * BTUToken
     */
    // Address of BTUToken smart contract
    address public btuTokenAddress;

    // Construtor
    function BTUTokenSale() public {
        owner = msg.sender;
        btuTokenAddress = new BTU();
        companyReservedDefrosted = false;
        foundersReservedDefrosted = false;
        bountyReservedDefrosted = false;
    }

    /* Assignment of tokens has to be done by the owner of the BTUToken
     * It is done in batches of addreses with corresponding amounts
     * For the transfer to work the owner has to approve the transfer for each address first
     * When assigning tokens one should remember that 1BTU = 10**18 as decimals must be accounted for.
     * Sorting of the 2 arrays given as arguments must be the same as well as their length
     */
    function assignToken(address _batchAddr, uint _batchAmount) public onlyOwner {
        // Verify that the sale has started
        require(now > SALE_START_DATE);

        assignedTokens = assignedTokens.add(_batchAmount);
        BTU(btuTokenAddress).transfer(_batchAddr, _batchAmount); // Transfer BTU amount to the corresponding address
    }

    /**
     * Sets the frosted account for the company, the founders and the bounty
     * This function must be called before any another to ensure assignedTokens has the right value.
     */
    function setupFrostedAccounts(address _companyAddress,
                                  address _foundersAddress,
                                  address _bountyAddress) public onlyOwner {
        companyAddress = _companyAddress;
        foundersAddress = _foundersAddress;
        bountyAddress = _bountyAddress;
        // Reserve the frosted tokens
        uint256 initialSupply = BTU(btuTokenAddress).totalSupply();
        companyReserved = initialSupply.mul(FROST_COMPANY_FACTOR) / 100;
        foundersReserved = initialSupply.mul(FROST_FOUNDERS_FACTOR) / 100;
        bountyReserved = initialSupply.mul(FROST_BOUNTY_FACTOR) / 100;
        // Keep track of the number of assigned tokens
        assignedTokens = companyReserved.add(foundersReserved);
        assignedTokens = assignedTokens.add(bountyReserved);
    }

    // Frost period for the frosted company tokens
    function defrostCompanyDate() internal view returns(uint256){
        return SALE_START_DATE.add(FROSTED_COMPANY_LOCKUP).mul(1 years);
    }

    // Defrost company reserved tokens
    function defrostCompanyTokens() public onlyOwner {
        require(companyReservedDefrosted == false);
        require(now > defrostCompanyDate());
        BTU(btuTokenAddress).transfer(companyAddress, companyReserved);
        companyReservedDefrosted = true;
    }

    // Frost period for the frosted founders tokens
    function defrostFoundersDate() internal view returns(uint256){
        return SALE_START_DATE.add(FROSTED_FOUNDERS_LOCKUP).mul(1 years);
    }

    // Defrost founders reserved tokens (only usable after the frost period is over)
    function defrostFoundersTokens() public onlyOwner {
        require(foundersReservedDefrosted == false);
        require(now > defrostFoundersDate());
        BTU(btuTokenAddress).transfer(foundersAddress, foundersReserved);
        foundersReservedDefrosted = true;
    }

    // No frost period for the bounty, the owner can defrost at will
    function defrostBountyTokens() public onlyOwner {
        require(bountyReservedDefrosted == false);
        BTU(btuTokenAddress).transfer(bountyAddress, bountyReserved);
        bountyReservedDefrosted = true;
    }

    // Selfdestruct this contract
    function destructContract() public onlyOwner {
        selfdestruct(owner);
    }
}
