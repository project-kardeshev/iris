# Iris

Iris is a WeaveVM based Video NFT minting and sharing platform. It allows for the tokenization of short videos, with social features such as likes and comments for each token. 

The Iris solidity contract consists of 3 separate pieces:

1. The channel factory

2. User channels

3. Video NFTs


## Channel Factory

The Channel Factory is the main entry point to the Iris ecosystem. It allows for the creation and discoverability of Creator channels.

### Channel Factory ABI

```js
const channelFactoryAbi = [
  "function getDeployedChannels() public view returns (address[])",
  "function getChannelInfoByWallet(address _uploader) public view returns (tuple(address uploader, string channelName, string channelDescription, address channelAddress))",
  "function createChannelContract(string _channelName, string _channelDescription, string _logo) public",
  "function withdraw() public"
];
```

### Functions

#### getDeployedChannels

getDeployedChannels does not require input, and returns an array of strings representing the contract addresses of channels deployed by the factory

#### getChannelInfoByWallet

getChannelInfoByWallet requires an address as input, and returns a tuple containing the information for the channel owned by the provided address in the following order

channel owner address, channel name, channel description, channel address

NOTE: only values are returned, not key names

#### createChannel

createChannel requires 3 inputs: channel name, channel description, and logo. 

The logo must be a string, and should represent the Arweave txId for an image

Only 1 channel can exist for a given wallet address, and the function will error if a channel already exists.

#### withdraw

When channels withdraw tipped funds from their channel, 5% is sent to the channel factory that created the channel. The owner of the channel factory can withdraw these funds. withdraw requires no input and provides no output.


## Channel

A channel is how a creator creates videos, and contains some basic information about the creator. Users may support a creator by "tipping" funds to a channel, which creators can withdraw. a 5% fee is diverted from these withdrawals to the channel factory that created the channel.

Channels also keep a list of the contract addresses for created videos, helping with discoverability.

### ABI

```js
const channelAbi = [
  "function getChannelInfo() public view returns (address, string, string, string, address, address[])",
  "function tipChannel() public payable",
  "function withdraw() public",
  "function mintVideo(string _arweaveTxId, string _videoName, string _videoDescription) public",
  "function registerVideo(address _videoAddress) public",
];
```

### Functions

#### getChannelInfo

getChannelInfo requires no input, and returns channel information in the following order:

address of channel creator, channel name, channel description, logo, contract address of channel factory, an array of created video contract addresses

Note: only values are returned, not key names

#### tipChannel

Tipping a channel is transferring TWVM (the native coin of WeaveVM) into a channel contract. This function must be called explicitly, a simple funds transfer will fail. No input is required, but the value of the transfer must be greater than 0. Emits a "TipReceived" event

#### withdraw

Only the creator of a channel can withdraw tipped funds. on withdrawal, 5% of the tipped funds are transferred to the Channel Factory that created it.

#### mintVideo

Minting a video spawn a new video NFT contract. It requires 3 inputs in the following order:

arweaveTxId representing a video (7.2Mib limit currently, will raise to 18Mb before judging), video name, video description

When the video is minted, that contract will call the registerVideo function to add itself to the list of deployed videos

## Video

Each video is a self contained contract and most end user interactions will be through individual video contracts

### ABI

```js
const videoAbi = [
  "function getVideo() public view returns (bytes)",
  "function approve(address _approved) public",
  "function safeTransferFrom(address _to, address _newChannel) public",
  "function getTokenInfo() public view returns (string, string, address, string, address, address, uint256)",
  "function like() public",
  "function getLikeNumber() public view returns (uint256)",
  "function leaveComment(string _comment) public",
  "function getComments() public view returns (tuple(uint256 timestamp, address commenter, string comment)[])",
  "function getOwner() public view returns (address)"
];
```

### Functions

#### getVideo

getVideo is the primary purpose of the video contracts. It takes the arweave TxId provided at video creation and feeds it into the WeaveVM precompile 18 in order to get a byte array representing the data found on arweave, it then returns that byte array. No input is required for getVideo

#### approve

Approving gives transfer authority to another wallet or contract address. The approved address needs to be provided as input.

Only 1 approved address is allowed, and any new approval will overwrite any previous approval.

approval can be revoked by calling approve with address(0)


#### safeTransferFrom

safeTransferFrom adds a few additional safety restrictions from the traditional transfer method. It verifies that the receiving address is valid before transferring in order to prevent mistaken transfers. This also prevents transferring to the burn address address(0)

safeTransferFrom requires 2 addresses as input, the address to receive the token, and the contract address of a new channel to associate the video with. New channels are not currently implemented, so address(0) should be provided for this input.

Transferring resets approvals, and removes the channel address from the video's internal info.

#### getTokenInfo

getTokenInfo gets meta data from the video contract. it requires no input.

getTokenInfo returns information in the following order:

video name, arweaveTxId, address of the channel factory that created the channel that created the video, video description, address of the original creator of the video, current owner address, created at timestamp

NOTE: only values are returned, not key names

#### like

like requires no input, and adds a "like" to a video. the contract tracks internally which addresses have liked a video so a wallet cannot like more than once. It is currently not possible to remove a like from a video.

#### getLikeNumber

Requires no input, returns the number of likes on a video

#### leaveComment

leaveComment requires a string input, the string represents a comment on the video and will be saved internally. It is not currently possible to reply to a comment, all comments are put on the video directly.

the comment will be entered into an object containing 3 properties:

timestamp: timestamp of the block where the comment was left
commenter: the address of the commenter
comment: the comment string

#### getComments

gets all comments on a video. filters were removed to comply with contract size limits on deployment.

no input is required, it returns an array of tuples in the following order

timestamp, commenter, comment

Note only values are returned not key names

It is also important to note that the output will appear as a stringified array with no separation between different comment objects, output will need to be parsed based on the index of values to determine what comment they are associated with and what each individual item represents.

### getOwner

gets the address of the current owner of the video contract, requires no input and provides an address as output.
