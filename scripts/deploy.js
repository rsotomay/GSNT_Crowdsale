// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const NAME = "GASton";
  const SYMBOL = "GSNT";
  const MAX_SUPPLY = "1000000";
  const PRICE = ethers.parseUnits("0.025", "ether");
  const MIN_PURCHASE = ethers.parseUnits("10", "ether");
  const MAX_PURCHASE = ethers.parseUnits("20000", "ether");
  const CROWD_SALE_OPENED = (Date.now() + 180000).toString().slice(0, 10);
  const CROWD_SALE_CLOSED = (Date.now() + 1800000).toString().slice(0, 10);

  const Token = await hre.ethers.deployContract("Token", [
    NAME,
    SYMBOL,
    MAX_SUPPLY,
  ]);
  await Token.waitForDeployment();
  console.log(`Token Deployed to: ${Token.target}\n`);

  const Crowdsale = await hre.ethers.deployContract("Crowdsale", [
    Token.target,
    PRICE,
    ethers.parseUnits(MAX_SUPPLY, "ether"),
    MIN_PURCHASE,
    MAX_PURCHASE,
    CROWD_SALE_OPENED,
    CROWD_SALE_CLOSED,
  ]);
  await Crowdsale.waitForDeployment();
  console.log(`Crowdsale Deployed to: ${Crowdsale.target}\n`);

  //send all tokens to crowdsale
  const transaction = await Token.transfer(
    Crowdsale.target,
    ethers.parseUnits(MAX_SUPPLY, "ether")
  );
  await transaction.wait();

  console.log(`Tokens transferred to Crowdsale\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
