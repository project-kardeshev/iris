// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./video.sol";

interface IChannelFactory {
    function registerChannel(
        address _uploader,
        address _channelAddress
    ) external;
}

contract Channel {
    address public uploader;
    string public channelName;
    string public channelDescription;
    string public logo;
    address public channelFactory;
    address[] public videoContracts;

    event TipReceived(address indexed sender, uint256 amount);
    event FundsWithdrawn(address indexed uploader, uint256 amount);
    event VideoMinted(address videoAddress);

    constructor(
        address _uploader,
        string memory _channelName,
        string memory _channelDescription,
        string memory _logo
    ) {
        uploader = _uploader;
        channelName = _channelName;
        channelDescription = _channelDescription;
        logo = bytes(_logo).length > 0 ? _logo : "";
        channelFactory = msg.sender;

        IChannelFactory(channelFactory).registerChannel(
            _uploader,
            address(this)
        );
 
    }

    function getChannelInfo()
        public
        view
        returns (
            address,
            string memory,
            string memory,
            string memory,
            address,
            address[] memory
        )
    {
        return (
            uploader,
            channelName,
            channelDescription,
            logo,
            channelFactory,
            videoContracts
        );
    }

    function tipChannel() public payable {
        require(msg.value > 0, "Tip amount must be greater than zero");
        emit TipReceived(msg.sender, msg.value);
    }

    function withdraw() public {
        require(
            msg.sender == uploader,
            "Only the channel owner can withdraw funds"
        );
        uint256 balance = address(this).balance;
        require(
            balance > 100,
            "Balance must be greater than 100 of the smallest unit of the chain's native token"
        );
        uint256 royalty = (balance * 5) / 100;
        uint256 amountToWithdraw = balance - royalty;

        (bool royaltySent, ) = payable(channelFactory).call{value: royalty}("");
        // require(royaltySent, "Failed to send royalty to channel factory");

        (bool success, ) = payable(uploader).call{value: amountToWithdraw}("");
        // require(success, "Failed to withdraw funds");

        emit FundsWithdrawn(uploader, amountToWithdraw);
    }

    function mintVideo(
        string memory _arweaveTxId,
        string memory _videoName,
        string memory _videoDescription
    ) public {
        require(
            msg.sender == uploader,
            "Only the channel owner can mint videos"
        );
        VideoNFT newVideo = new VideoNFT(
            _arweaveTxId,
            _videoName,
            _videoDescription,
            channelFactory,
            uploader,
            address(this)
        );
        
    }

    function registerVideo(address _videoAddress ) public {
        address videoAddress = _videoAddress;
        require(msg.sender == videoAddress, "unauthorized");
        videoContracts.push(videoAddress);
      emit VideoMinted(videoAddress);  
    }
}
