
pragma solidity ^0.4.22;

contract SimpleAuction {
  address public beneficiary; // 拍卖的受益人
  uint public auctionEnd; // 拍卖的结束时间

  address public highestBidder; // 当前的最高出价者
  uint public highestBid; // 当前的最高出价

  mapping(uint => address) myToken; //记录每次拍卖的最高出价者
  mapping(uint => string) tokenName; // 记录每次拍卖的物品名
  mapping(address => uint) pendingReturns; // 记录每个人没有达成交易的投入金额

  string s = "Nothing"; // 当前拍卖的物品名
  uint x = 0; // 当前的剩余时间
  string checkn = ""; //查询的拍卖品名
  uint index = 0; //当前拍卖的序号

  bool begin = false; // 是否有进行中的拍卖

  // event LogUint(string s, uint x);

  /// 创建一个新的拍卖，参数为拍卖品名字
  function setSimpleAuction(string name) public returns (bool) {
    require(begin != true);
    index ++;
    s = name;
    uint _biddingTime = 300; // 每次拍卖持续的时间
    beneficiary = msg.sender;
    highestBidder = msg.sender;
    highestBid = 0;
    auctionEnd = now + _biddingTime;
    begin = true;
    changeNow();
    return true;
  }

  function changeNow() public {
    if(now > auctionEnd || begin == false) {
      x = 0;
    }
    else{
      x = auctionEnd - now;
    }
  }

  function checkInfo() public view returns(string, uint, uint, uint) {
    // emit LogUint(s, x);
    return (s, x, index, highestBid);
  }

  // 出价，当小于当前最高时不成立，当被超过时记录数据，等待被用户主动取回
  function bid() public payable {

    require(now <= auctionEnd);
    // 如果出价不够，交易撤回
    require(msg.value > highestBid);

    if (highestBid != 0) {
      pendingReturns[highestBidder] += highestBid;
    }
    highestBidder = msg.sender;
    highestBid = msg.value;
    changeNow();
  }

  // 取回被超出的拍卖前的出资
  function withdraw() public returns (bool) {
    uint amount = pendingReturns[msg.sender];
    require(amount > 0);
    if (amount > 0) {
      pendingReturns[msg.sender] = 0;

      if (!msg.sender.send(amount)) {
        pendingReturns[msg.sender] = amount;
        return false;
      }
    }
    return true;
  }

  // 通过编号查询已经结束的拍卖
  function checkToken(uint i) public returns (address, string) {
    require(i < index);
    address addr = myToken[i];
    checkn = tokenName[i];
    return (addr, checkn);
  }

  // 结束拍卖，将金额给予受益人
  function auctionEnd() public {
    require(now >= auctionEnd);
    require(highestBidder == msg.sender);
    begin = false;
    highestBid = 0;
    tokenName[index] = s;
    myToken[index] = highestBidder;
    s = "Nothing";
    beneficiary.transfer(highestBid);
  }
}
