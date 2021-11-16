// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

//import "@openzeppelin/contracts/ownership/Ownable.sol";


//// Solidity Pitalls & Attacks
//// Use Specific Complier Pragma 
/// Pull over push ??
//// Use modifiers only for validDuration

// From Smart Contract Pitfalls and Attacks
// Not everything can be avoided, but you can write if you’re taking protection against:
// Re-entrancy
// Timestamp Dependence
// Forcibly Sending Ether
// Tx.Origin Authentication

//library for reentry
//https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol


/// @title An product auction for commodities 
/// @author Alexander Poe
/// @notice This contract is in a prototype 
/// @dev All function calls are currently implemented without side effects
/// @custom:experimental This is an experimental contract.
contract ProductAuction { // Auction is created by one owner, who can post multiple products
    address payable public owner;
    uint public auctionCount;
    
    mapping(uint => Auction) public auctions;
    
    enum State { Active, Ended, Cancelled }
    
    struct Bidder {
        address payable addr;
        uint amount;
    }
    
    /// what is the actual product and how does the winner recieve it?
    struct Auction {
        string productName;
        uint gtin;
        uint price;
        uint auctionNum;
        State state;
        uint highestBid;
        uint auctionDuration;
        mapping (address => Bidder) bidders;
        address payable seller;
        address payable buyer;
    }
    
    
    event AuctionActive(uint gtin, string productName);
    
    event NewBid(uint gtin, string productName, uint highestBid);
    
    event AuctionClosed(uint gtin, string productName);
    
    event AuctionResults(uint gtin, string productName, uint highestBid, address seller);
    
    event AuctionCancelled(uint auctionNum);
    
    event BidWithdrawn(address bidder, uint amount);
    
    /// caller is owner
    modifier isOwner() { 
        require(
            msg.sender == owner,
            "Only owner can call this function."
            );
        _;
    }
    
    /// caller is not owner
    modifier isNotOwner(){
        require(
            msg.sender != owner,
            "Function cannot be called by the owner."
            );
        _;
    }
    
    /// auction is active
    modifier isActive(uint _auctionNum){
        require(
            auctions[_auctionNum].state == State.Active,
            "Auction is not active."
            );
        _;
    }
    
    /// bid can be withdrawn if auction is finished or cancelled
    modifier bidIsAvailableToWithdrawl(uint _auctionNum) {
        require(
            block.timestamp > auctions[_auctionNum].auctionDuration || auctions[_auctionNum].state == State.Cancelled,
            "Auction is stil active."
            );
        _;
    }
    
    modifier saleIsAvailabletoWithdrawl(uint _auctionNum) {
        require(
            block.timestamp > auctions[_auctionNum].auctionDuration && auctions[_auctionNum].state != State.Cancelled,
            "Sale can only be withdrawn if auction is over and not cancelled"
            );
        _;
    }
    
    
    
    /// bid is 10 higher then previous
    modifier isEnough(uint _auctionNum, uint _bid) {
        require(
            _bid >= auctions[_auctionNum].highestBid + 10,
            "Bid must be at least 10 more then previous bid."
            );
        _;
    }
    
    /// did not win auction
    modifier isNotWinner(uint _auctionNum, address _bidder) {
        require(
            auctions[_auctionNum].buyer != _bidder,
            "Cannot withdrawl bid if won auction."
            );
        _;
    }
    
    /// ensure auction duration is between 5 & 10 days
    modifier validDuration(uint _auctionDuration) {
        require(
            _auctionDuration >= 5 && _auctionDuration <= 10,
            "Auction must be at least 5 days long."
            );
        _;
    }
    
    //// ensure price is not zero
    modifier isNotZero(uint _price) {
        require(
            _price != 0,
            "Price must be greater then zero"
            );
        _;
    }
    
    modifier onlyBeforeAuctionEnd(uint _auctionNum) {
        require(
            block.timestamp < auctions[_auctionNum].auctionDuration,
            "Auction has eneded"
            );
        _;
    }

    function createAuction(string memory _productName, uint _gtin, uint _price, uint _auctionDuration) 
        public
        isOwner()
        validDuration(_auctionDuration)
        isNotZero(_price)
        returns (bool)
    {
        
        Auction storage a = auctions[auctionCount];
        a.productName = _productName;
        a.gtin = _gtin;
        a.price = _price;
        a.auctionNum = auctionCount;
        a.state = State.Active;
        a.highestBid = _price;
        a.auctionDuration = block.timestamp + (_auctionDuration * 1 days);
        a.seller = owner;
        a.buyer = owner;
        
        auctionCount = auctionCount + 1;
        emit AuctionActive(_gtin, _productName);
        return true;
    }
    
    function makeBid(uint _auctionNum) 
        public
        payable
        isNotOwner()
        isActive(_auctionNum)
        onlyBeforeAuctionEnd(_auctionNum)
        isEnough(_auctionNum, msg.value) // do i need msg.value? 
    {
        
        Auction storage a = auctions[_auctionNum];
        a.highestBid = msg.value;
        a.buyer = payable(msg.sender);
        
        Bidder storage bz = a.bidders[msg.sender];
        bz.addr = payable(msg.sender);
        
        // if there is already a bid, transfer previous bid to bidder
        if (bz.amount != 0) {
            bz.addr.transfer(bz.amount);
        }
        
        bz.amount = msg.value;

        emit NewBid(auctions[_auctionNum].gtin, auctions[_auctionNum].productName, auctions[_auctionNum].highestBid);
        
    }
    
    /// withdrawl bid after auction is over IF not winnner or if auction is cancelled 
    function withdrawlBid(uint _auctionNum)
        public
        payable
        bidIsAvailableToWithdrawl(_auctionNum)
        isNotWinner(_auctionNum, msg.sender)
        
    {
        Auction storage a = auctions[_auctionNum];
        a.bidders[msg.sender].addr.transfer(a.bidders[msg.sender].amount);
        emit BidWithdrawn(msg.sender, a.bidders[msg.sender].amount);
        
    }
    
    function withdrawlProceeds(uint _auctionNum)
        public
        payable
        isOwner()
        saleIsAvailabletoWithdrawl(_auctionNum)
    {
        
    }
    
    // owner can cancel auction
    function cancelAuction(uint _auctionNum) 
        public
        payable
        isOwner()
        isActive(_auctionNum)
    {
        auctions[_auctionNum].state = State.Cancelled;
        auctions[_auctionNum].buyer = payable(msg.sender);
        emit AuctionCancelled(_auctionNum);
    }
    
    
    
    // Time function not needed if modifier requires transations to take place either before or after auction time
    // what if we make function calls set state in modifiers depending on whether time is before or after ?
    function auctionEnd()
        external
    {
        // function loops through all auctions and confirms that current time is less then auction duration
        for (uint i=0; i<auctionCount; i++) {
            if (block.timestamp < auctions[i].auctionDuration && auctions[i].state != State.Cancelled) {
                emit AuctionActive(auctions[i].gtin, auctions[i].productName);
            } else if (auctions[i].state != State.Cancelled) {
                auctions[i].state = State.Ended;
                emit AuctionClosed(auctions[i].gtin, auctions[i].productName);
            }
        }
        
    }
    
    /// need function that works with time library to identify when current times passes the aunction duration, afer that it will set the state to ended
    
    constructor() {
        owner = payable(msg.sender);
        auctionCount = 0;
    }
    
}
