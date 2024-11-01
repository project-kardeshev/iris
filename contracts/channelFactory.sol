// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./channel.sol";

contract ChannelFactory {
    struct ChannelInfo {
        address uploader;
        string channelName;
        string channelDescription;
        address channelAddress;
    }

    mapping(address => ChannelInfo) public channels;
    address[] public deployedChannels;
    address public owner;

    event ChannelCreated(
        address indexed creator,
        address channelAddress,
        string channelName,
        string channelDescription
    );
    event FundsWithdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() payable {
        owner = msg.sender;
    }

    function createChannelContract(
        string memory _channelName,
        string memory _channelDescription,
        string memory _logo
    ) public {
        require(
            channels[msg.sender].uploader == address(0),
            "Channel already exists for this wallet"
        );

        Channel newChannel = new Channel(
            msg.sender,
            _channelName,
            _channelDescription,
            _logo
        );
        address channelAddress = address(newChannel);
       

        ChannelInfo memory newChannelInfo = ChannelInfo({
            uploader: msg.sender,
            channelName: _channelName,
            channelDescription: _channelDescription,
            channelAddress: channelAddress
        });
        channels[msg.sender] = newChannelInfo;

        emit ChannelCreated(
            msg.sender,
            channelAddress,
            _channelName,
            _channelDescription
        );
    }

    function registerChannel(
        address _creatorAddress,
        address _channelAddress
    ) public {
        address creatorAddress = _creatorAddress;
        address channelAddress = _channelAddress;
        require(msg.sender == channelAddress, "unauthorized");
        channels[creatorAddress].channelAddress = channelAddress;
        deployedChannels.push(channelAddress);

        
    }

    function getChannelInfoByWallet(
        address _uploader
    ) public view returns (ChannelInfo memory) {
        require(
            channels[_uploader].uploader != address(0),
            "Channel does not exist"
        );
        return channels[_uploader];
    }

    function getDeployedChannels() public view returns (address[] memory) {
        return deployedChannels;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdrawal failed");

        emit FundsWithdrawn(owner, balance);
    }
}
