require("dotenv").config({ path: ".env" });
const hre = require("hardhat");

async function main() {
  const Bounty = await hre.ethers.getContractFactory("Bounty");
  const bounty = await Bounty.deploy(process.env.TOKEN_ADDRESS);
  await bounty.deployed();

  console.log("Bounty deployed to:", bounty.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
