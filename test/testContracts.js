require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const SECOND_PRIVATE_KEY = process.env.SECOND_PRIVATE_KEY;
const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS;
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const channelFactoryAbi = [
  "function getDeployedChannels() public view returns (address[])",
  "function getChannelInfoByWallet(address _uploader) public view returns (tuple(address uploader, string channelName, string channelDescription, address channelAddress))",
  "function createChannelContract(string _channelName, string _channelDescription, string _logo) public",
];

// const channelAbi = [
//   "function getChannelInfo() public view returns (address, string memory, string memory, string memory, address, address[] memory)",
//   "function updateChannel(string _channelName, string _channelDescription, string _logo) public",
//   "function tipChannel() public payable",
//   "function withdraw() public",
//   "function mintVideo(string _arweaveTxId, string _videoName, string _videoDescription) public",
//   "function getVideo() public view returns (bytes memory)",
//   "function like() public",
//   "function unlike() public",
//   "function getLikeNumber() public view returns (uint256)",
//   "function leaveComment(string _comment) public",
//   "function getComments(address _commenter, uint256 _afterTimestamp, uint256 _limit, bool _mostRecent) public view returns (tuple(uint256, address, string)[])",
//   "function safeTransferFrom(address _to, address _newChannel) public"
// ];

const channelAbi = [
  "function getChannelInfo() public view returns (address, string, string, string, address, address[])",
  "function tipChannel() public payable",
  "function withdraw() public",
  "function mintVideo(string _arweaveTxId, string _videoName, string _videoDescription) public",
  "function registerVideo(address _videoAddress) public",
];

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

const logDirPath = path.join(__dirname, "testLogs");
if (!fs.existsSync(logDirPath)) {
  fs.mkdirSync(logDirPath, { recursive: true });
}

const logFilePath = path.join(logDirPath, `test-log-${Date.now()}.log`);

if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, "");
}

function logToFile(message) {
  fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${message}\n`);
}

async function main() {
  try {
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const walletAddress = "0xba8172DcaB4A44DcE5B7bFc00236188697fe805d";
    const secondWallet = new ethers.Wallet(SECOND_PRIVATE_KEY, provider);
    const secondWalletAddress = "0x6B324A1F65DEcd2aD945BAA84cA75F018Be8Cec3";
    const factoryContract = new ethers.Contract(
      FACTORY_ADDRESS,
      channelFactoryAbi,
      wallet
    );
    let _channelAddress;

    logToFile("Testing getDeployedChannels...");
    const deployedChannels = await factoryContract.getDeployedChannels();
    logToFile(`Deployed channels: ${deployedChannels}`);

    if (deployedChannels.length > 0) {
      for (const channelAddress of deployedChannels) {
        const channelInfo = await factoryContract.getChannelInfoByWallet(
          walletAddress
        );
        logToFile(
          `Channel info for ${walletAddress}: ${JSON.stringify(channelInfo)}`
        );
      }
    }

    logToFile("Testing createChannelContract...");
    try {
      const result = await factoryContract.createChannelContract(
        "TestChannel",
        "A test channel",
        ""
      );
      logToFile("Channel created successfully.");
      logToFile(JSON.stringify(result));
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      logToFile(`Error creating channel: ${error.message}`);
    }

    logToFile("Testing getChannelInfo after createChannelContract...");
    const deployedChannels2 = await factoryContract.getDeployedChannels();
    logToFile(`Deployed channels: ${deployedChannels2}`);

    if (deployedChannels2.length > 0) {
      for (const channelAddress of deployedChannels2) {
        const channelInfo = await factoryContract.getChannelInfoByWallet(
          walletAddress
        );
        _channelAddress = channelInfo.channelAddress;
        logToFile(
          `Channel info for ${channelAddress}: ${JSON.stringify(channelInfo)}`
        );
      }
    }

    // channelAddress = "0x998cF8C07E2AFCc6eA5E7348cf3706F5be3c98E1";
    const channelContract = new ethers.Contract(
      _channelAddress,
      channelAbi,
      wallet
    );

    logToFile("Testing getChannelInfo on channel contract...");
    const channelData = await channelContract.getChannelInfo();
    logToFile(`Channel data: ${JSON.stringify(channelData)}`);

    logToFile("Testing tip from SECOND_PRIVATE_KEY...");
    const secondWalletChannelContract = new ethers.Contract(
      _channelAddress,
      channelAbi,
      secondWallet
    );
    // try {
    //   const tx = await secondWalletChannelContract.tipChannel({
    //     value: ethers.parseEther("0.005"),
    //   });
    //   await tx.wait();
    //   logToFile("Tip successful.");
    // } catch (error) {
    //   logToFile(`Error tipping: ${error.message}`);
    // }

    logToFile("Testing withdraw with SECOND_PRIVATE_KEY (should fail)...");
    try {
      await secondWalletChannelContract.withdraw();
    } catch (error) {
      logToFile(
        `Expected error withdrawing with second wallet: ${error.message}`
      );
    }

    logToFile("Testing withdraw with PRIVATE_KEY...");
    // await channelContract.withdraw();
    logToFile("Withdraw successful.");

    logToFile("Testing mintVideo with SECOND_PRIVATE_KEY (should fail)...");
    try {
      await secondWalletChannelContract.mintVideo(
        "Qe9bt24NLCPHXeCRsehP1C-MIPZ5uu4-oIwJpCX4mfM",
        "Test Video",
        "Test Description"
      );
    } catch (error) {
      logToFile(
        `Expected error minting video with second wallet: ${error.message}`
      );
    }

    logToFile("Testing mintVideo with PRIVATE_KEY...");
    const tx = await channelContract.mintVideo(
      "bZRMNrsK5sjwOhDKikGp5L-FBaPJ2vbAgltWaB_pGL0",
      "Test Video",
      "Test Description"
    );
    const receipt = await tx.wait();
    logToFile(`Mint video transaction receipt: ${JSON.stringify(receipt)}`);
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const finalChannelInfo = await channelContract.getChannelInfo();
    logToFile(
      `Final channel info with video: ${JSON.stringify(finalChannelInfo)}`
    );

    logToFile("Testing getVideo on video contract...");
    const videoContractAddress =
      finalChannelInfo[5][finalChannelInfo[5].length - 1];
    const videoContract = new ethers.Contract(
      videoContractAddress,
      videoAbi,
      wallet
    );
    const videoContent = await videoContract.getVideo();
    // logToFile(`Video content: ${videoContent}`);

    logToFile("Testing like on video contract...");
    try {
      await videoContract.like();
    } catch (err) {
      logToFile(`error on like: ${err}`);
    }

    try {
      await videoContract.like();
    } catch (error) {
      logToFile(`Expected error on second like: ${error.message}`);
    }
    const likeNumber = await videoContract.getLikeNumber();
    logToFile(`Number of likes: ${likeNumber}`);

    logToFile("Testing leaveComment on video contract...");
    await videoContract.leaveComment("This is a test comment.");
    logToFile("Comment added successfully.");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    logToFile("Testing getComments on video contract...");
    try {
      const comments = await videoContract.getComments();
      logToFile(comments)
      logToFile(`Comments: ${JSON.stringify(comments)}`);
    } catch (err) {
      logToFile(`error getting comment: ${err}`);
    }

    logToFile(`attempting to get video info`);
    try {
        const localAddress = await videoContract.getAddress()
        logToFile(localAddress)
      const videoInfo = await videoContract.getTokenInfo();
      logToFile(videoInfo);
    } catch (err) {
      logToFile(`info error: ${err}`);
    }

    logToFile(
      "Testing transfer ownership of video contract to SECOND_PRIVATE_KEY..."
    );
    try {
      await videoContract.safeTransferFrom(
        secondWalletAddress,
        "0x0000000000000000000000000000000000000000"
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
      logToFile("Transfer to SECOND_PRIVATE_KEY successful.");
    } catch (err) {
      logToFile(`transfer error: ${err}`);
    }

    logToFile(`attempting to get video info again`);
    try {
        // const localAddress = await videoContract.getAddress()
        // logToFile(localAddress)
      const videoInfo = await videoContract.getTokenInfo();
      logToFile(videoInfo);
    } catch (err) {
      logToFile(`info error: ${err}`);
    }
    logToFile(
      "Testing transfer ownership of video contract back to original creator..."
    );

    const secondWalletVideoContract = new ethers.Contract(
      videoContractAddress,
      videoAbi,
      secondWallet
    );
    try {
      await secondWalletVideoContract.safeTransferFrom(
        walletAddress,
        "0x0000000000000000000000000000000000000000"
      );
      logToFile("Transfer back to original creator successful.");
    } catch (err) {
      logToFile(`transfer error: ${err}`);
    }
  } catch (error) {
    logToFile(`Unexpected error during tests: ${error.message}`);
    console.error(error);
  }
}

main();
