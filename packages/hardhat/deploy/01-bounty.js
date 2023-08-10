const { ethers } = require("hardhat");

async function main() {
  const Bounty = await ethers.getContractFactory("Bounty");
  const bounty = await Bounty.deploy(
    "0x8df6149871aBd91fb04b6D5254F274c9b723090F"
  );
  await bounty.deployed();
  console.log("Bounty deployed to:", bounty.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
