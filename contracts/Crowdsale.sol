// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Token.sol";

contract Crowdsale {
    address public owner;
    Token public token;
    uint256 public price;
    uint256 public maxTokens;
    uint256 public tokensSold;

    event Buy(uint256 amount, address buyer);
    event Finalize(uint256 tokenSold, uint256 etherRaised);

    constructor(Token _token, uint256 _price, uint256 _maxTokens) {
        token = _token;
        price = _price;
        maxTokens = _maxTokens;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller must be owner");
    _;
}
    receive() external payable {
        uint256 amount = msg.value / price;
        buyTokens(amount * 1e18);
    }

    function buyTokens(uint256 _amount) public payable {
        require(token.balanceOf(address(this)) >= _amount);
        require(msg.value == (_amount / 1e18) * price);
        require(token.transfer(msg.sender, _amount));

        tokensSold += _amount;

        emit Buy(_amount, msg.sender);
    }

    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

    function finalize() public onlyOwner {
        //Send remaining tokens to crowdsale creator
        require(token.transfer(owner, token.balanceOf(address(this))));
        //Send Ether to crowdsale creator
        uint256 value = address(this).balance;
        (bool sent, ) = owner.call{value: value}('');
        require(sent);

        emit Finalize(tokensSold, value);
    }
}