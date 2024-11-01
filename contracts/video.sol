// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IChannel {
    function registerVideo(
        address _channelAddress
    ) external;
}

contract VideoNFT {
    address public originalCreator;
    address public owner;
    address public channelFactory;
    address public channel;
    string public arweaveTxId;
    string public videoName;
    string public videoDescription;
    uint256 public createdAt;
    address public approved;
    uint256 public likeCount;
    mapping(address => bool) public likes;
    address[] public likers;

    struct Comment {
        uint256 timestamp;
        address commenter;
        string comment;
    }

    Comment[] public comments;

    event Approval(address indexed owner, address indexed approved);
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
    event VideoLiked(address indexed liker);
    event CommentAdded(
        address indexed commenter,
        uint256 timestamp,
        string comment
    );

    modifier onlyOwner() {
        require(
            msg.sender == originalCreator,
            "Only the owner can call this function"
        );
        _;
    }

    constructor(
        string memory _arweaveTxId,
        string memory _videoName,
        string memory _videoDescription,
        address _channelFactory,
        address _originalCreator,
        address _originalChannel
    ) {
        arweaveTxId = _arweaveTxId;
        videoName = _videoName;
        videoDescription = _videoDescription;
        channelFactory = _channelFactory;
        originalCreator = _originalCreator;
        owner = _originalCreator;
        channel = _originalChannel;
        createdAt = block.timestamp;

        IChannel(channel).registerVideo(address(this));
    }

    function getVideo() public view returns (bytes memory) {
        bytes memory data = abi.encodePacked(arweaveTxId);
        (bool success, bytes memory result) = address(0x18).staticcall(data);

        return result;
    }

    function approve(address _approved) public onlyOwner {
        approved = _approved;
        emit Approval(originalCreator, _approved);
    }

    function safeTransferFrom(address _to, address _newChannel) public {
        require(
            msg.sender == owner || msg.sender == approved,
            "Caller is not owner nor approved"
        );
        require(_to != address(0), "Invalid address");

        address previousOwner = owner;
        address previousChannel = channel;

        owner = _to;
        approved = address(0);

        if (_newChannel != address(0)) {
            channel = _newChannel;
        } else {
            channel = address(0);
        }

            // require(success, "Failed to remove video from previous channel");
        

        emit OwnershipTransferred(previousOwner, _to);
    }

    function getOwner() public view returns (address) {
    return owner;
}


    function getTokenInfo()
        public
        view
        returns (
            string memory,
            string memory,
            address,
            string memory,
            address,
            address,
            uint256
        )
    {
        return (
            videoName,
            arweaveTxId,
            channelFactory,
            videoDescription,
            originalCreator,
            owner,
            createdAt
        );
    }

    function like() public {
        require(!likes[msg.sender], "You have already liked this video");
        likes[msg.sender] = true;
        likers.push(msg.sender);
        likeCount++;
        emit VideoLiked(msg.sender);
    }

    function getLikeNumber() public view returns (uint256) {
        return likeCount;
    }

    function leaveComment(string memory _comment) public {
        
        comments.push(
            Comment({
                timestamp: block.timestamp,
                commenter: msg.sender,
                comment: _comment
            })
        );
        emit CommentAdded(msg.sender, block.timestamp, _comment);
    }

    function getComments() public view returns (Comment[] memory) {
        return comments;
    }
}
