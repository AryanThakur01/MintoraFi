// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.4.9 <0.9.0;
pragma experimental ABIEncoderV2;

import "./HederaTokenService.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";

// all amounts are in tinybars
contract NFT is HederaTokenService {
  mapping(bytes32 => uint256) public prices;
  event Debug(uint256 price, uint256 sentValue, uint256 senderBalance, address owner, address buyer);

  function getKey(address tokenAddress, uint256 serialNumber) internal pure returns (bytes32) {
    return keccak256(abi.encodePacked(tokenAddress, serialNumber));
  }

  function getCallerAddress() public view returns (address) {
    return msg.sender;
  }

  function getCallerBalance() public view returns (uint256) {
    return msg.sender.balance;
  }

  function setPrice(address tokenAddress, uint256 serialNumber, uint256 price) public returns (uint256) {
    require(
        IERC721(tokenAddress).ownerOf(serialNumber) == msg.sender,
        "Caller is not the owner of the NFT"
    );
    require(price > 0, "Price must be greater than zero");

    bytes32 key = getKey(tokenAddress, serialNumber);
    prices[key] = price;
    return prices[key];
  }
  
  function getPriceByKey(address tokenAddress, uint256 serialNumber) public view returns (uint256) {
    bytes32 key = getKey(tokenAddress, serialNumber);
    return prices[key];
  }

  function purchaseNft(address tokenAddress, uint256 serialNumber) public payable returns (bool) {
    bytes32 key = getKey(tokenAddress, serialNumber);
    uint256 price = prices[key];
    address owner = IERC721(tokenAddress).ownerOf(serialNumber);

    // checks for the nft
    require(msg.sender.balance >= price && price == msg.value && owner != msg.sender, "Insufficient payment or you are already the owner");

    // Pay fees to the receiver
    (bool sent, ) = owner.call{value: msg.value}("");
    // require(sent, "Failed to send tinybars");
    //
    // // Transfer the NFT to the buyer
    // IERC721(tokenAddress).transferFrom(owner, msg.sender, serialNumber);
    //
    // // Clear the price after purchase
    // delete prices[key];

    return true;
  }
}
