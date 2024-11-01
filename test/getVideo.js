const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();

const videoAbi = [
    "function getVideo() public view returns (bytes)",
    "function approve(address _approved) public",
    "function safeTransferFrom(address _to, address _newChannel) public",
    "function getTokenInfo() public view returns (string, string, address, string, address, uint256)",
    "function like() public",
    "function getLikeNumber() public view returns (uint256)",
    "function leaveComment(string _comment) public",
    "function getComments() public view returns (tuple(uint256 timestamp, address commenter, string comment)[] memory)",
  ];

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const videoAddress = "0x7b6e1E89C5C81Be38D9444B6E5585d404431F9d8";
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const videoContract = new ethers.Contract(videoAddress, videoAbi, wallet);

const logFilePath = "./getVideoLog.txt";

function logToFile(message) {
  fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${message}\n`);
}

async function main() {
  try {
    const videoContent = await videoContract.getVideo();
    logToFile(`Video content: ${videoContent}`);
    console.log(`Video content: ${videoContent}`);
  } catch (error) {
    logToFile(`Error getting video content: ${error.message}`);
    console.error("Error getting video content:", error);
  }
}

main();
