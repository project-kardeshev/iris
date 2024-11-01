require("dotenv").config();

async function main() {
  const MyContract = await ethers.getContractFactory(process.env.CONTRACT);

  const myContract = await MyContract.deploy({
    gasLimit: 500_000_000, // Adjust based on your contract needs
  });

  // Wait for the deployment transaction to be confirmed
  await myContract.waitForDeployment();

  console.log("MyContract deployed to:", await myContract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
