pragma solidity >=0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

interface Agreement {
///@notice creates terms
    function makeTerms(string memory _terms, string memory _agreementName, uint _cost, address _client) external returns(bool);
///@notice approves terms
    function approveTerms(bool _approve) external returns(bool);
///@notice adds payees
    function deposit() external payable returns(bool);
///@notice gets contract balance
    function getBalance() external view returns (uint);
///@notice fullfills agreement
    function fulfillAgreement(bool _approve) external returns(bool);
///@notice withdrawls funds
    function withdraw() external;
}


/// @title A smart contract for gig fullfillment
/// @author Alexander Poe
/// @notice This contract will be used to create agreement with docusign, handle payments and distribution
/// @notice for simplicity this will just takea astr
/// @dev All function calls are currently implemented without side effects
/// @custom:experimental This is an experimental contract use at your own risk.
contract gig is Ownable, Agreement {
    string public terms;
    string public agreementName;
    address public contractWriter;
    bool public termsApproved;
    bool public agreementFullfilled;
    address public client;
    uint public balance = address(this).balance;
    uint public cost;
    
    modifier isClient() {
        require(
            msg.sender == client,
            "Only Client can access this function"
            );
        _;
    }

    modifier mustBeFullfilled() {
        require(
            agreementFullfilled == true,
            "agreement needs to be fullfilled before money can be withdrawn"
            );
        _;
    }

     modifier termsAgreed() {
        require(
            termsApproved,
            "terms must be approved"
            );
        _;
    }

    modifier correctAmount() {
        require(
            cost == msg.value,
            "deposit must equal cost"
            );
        _;
    }

    event clientAdded(address _client);
    event termsCreated(string _at, uint _cost);
    event termsAgreedOn(string _terms, address _client, address _owner);
    event logDeposit(address _from, uint _amount);
    event logFullfilled(address _by, bool _approved);
    event logWithdraw(address _by);

    /// @notice after creating terms using Docusigns clickwrap, link to terms is submitted
    /// @param _terms _cost _client terms is the link to the Docusign clickwrap, cost is the specified cost of agreement _client is the client address
    /// @return true
    ///  @dev when adding clickwrap link a return address must be added 
    /// @inheritdoc Agreement
    function makeTerms(string memory _terms, string memory _agreementName, uint _cost, address _client) external override onlyOwner returns(bool) {
        agreementName = _agreementName;
        terms = _terms;
        cost = _cost;
        client = _client;
        emit termsCreated(_terms, _cost);
        return true;
    }
    /// @notice client approves terms on variable terms link, redirect link automatically sets agreement to approved
    /// @param _approve is true when agreement is made
    /// @return true
    /// @inheritdoc Agreement
    function approveTerms(bool _approve) external override isClient() returns(bool) {
        termsApproved = _approve;
        emit termsAgreedOn(terms, client, contractWriter);
        return true;
    }

    /// @notice once terms are agreed upon client makes deposit
    /// @return true
    /// @inheritdoc Agreement
    function deposit() external override payable isClient() termsAgreed() correctAmount() returns(bool) {
        balance = address(this).balance;
        emit logDeposit(msg.sender, msg.value);
        return true;
    }

    function getBalance() external view override returns (uint) {
        return address(this).balance;
    }

    /// @notice client approves fulfillment of agreement
    /// @param _approve is bool 
    /// @return bool
    /// @inheritdoc Agreement
    function fulfillAgreement(bool _approve) external override onlyOwner() returns(bool) {
        agreementFullfilled = _approve;
        emit logFullfilled(msg.sender, _approve);
        return _approve;
    }

    /// @notice once agreement is fulfilled payees can withdrawl their payment
    /// @dev the initial contract cost is used to determine payment so values are not altered as payments are withdrawn
    /// @inheritdoc Agreement
    function withdraw() external mustBeFullfilled() onlyOwner() override {
        payable(msg.sender).transfer(address(this).balance);
        balance = address(this).balance;
        emit logWithdraw(msg.sender);
    }

    constructor() {
        contractWriter = owner();
    }
  
}
