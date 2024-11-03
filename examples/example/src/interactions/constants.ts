export const ChannelFactoryABI = [
    "function getDeployedChannels() public view returns (address[])",
    "function getChannelInfoByWallet(address _uploader) public view returns (tuple(address uploader, string channelName, string channelDescription, address channelAddress))",
    "function createChannelContract(string _channelName, string _channelDescription, string _logo) public",
]

export const ChannelABI = [
    "function getChannelInfo() public view returns (address, string, string, string, address, address[])",
    "function tipChannel() public payable",
    "function withdraw() public",
    "function mintVideo(string _arweaveTxId, string _videoName, string _videoDescription) public",
    "function registerVideo(address _videoAddress) public",
]

export const VideoABI = [
    "function getVideo() public view returns (bytes)",
    "function approve(address _approved) public",
    "function safeTransferFrom(address _to, address _newChannel) public",
    "function getTokenInfo() public view returns (string, string, address, string, address, address, uint256)",
    "function like() public",
    "function getLikeNumber() public view returns (uint256)",
    "function leaveComment(string _comment) public",
    "function getComments() public view returns (tuple(uint256 timestamp, address commenter, string comment)[])",
    "function getOwner() public view returns (address)"
]

export const FACTORY_CONTRACT_ADDRESS = "0xD0F2dEAc2fBc1589aDAefa4E97908560010365E9"