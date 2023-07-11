const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};

const ether = tokens;

describe("Crowdsale", () => {
  let crowdsale, token;
  let accounts, deployer, user1;

  beforeEach(async () => {
    // Load contracts
    const Crowdsale = await ethers.getContractFactory("Crowdsale");
    const Token = await ethers.getContractFactory("Token");
    // Deploys Token contract
    token = await Token.deploy("Gaston", "GSTN", "1000000");
    // configures accounts
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    user1 = accounts[1];

    // Deploys Crowdsale contract
    crowdsale = await Crowdsale.deploy(token.getAddress(), ether(1), "1000000");

    // Sends tokens to crowdsale
    let transaction = await token
      .connect(deployer)
      .transfer(crowdsale.getAddress(), tokens(1000000));
    await transaction.wait();
  });

  describe("Deployment", () => {
    it("sends tokens to the crowdsale contract", async () => {
      expect(await token.balanceOf(crowdsale.getAddress())).to.equal(
        tokens(1000000)
      );
    });

    it("returns the price", async () => {
      expect(await crowdsale.price()).to.equal(ether(1));
    });

    it("returns token address", async () => {
      expect(await crowdsale.token()).to.equal(await token.getAddress());
    });

    it("returns the max tokens", async () => {
      expect(await crowdsale.maxTokens()).to.equal("1000000");
    });
  });

  describe("Buying Tokes", () => {
    let transaction, result;
    let amount = tokens(10);

    describe("Success", () => {
      beforeEach(async () => {
        transaction = await crowdsale
          .connect(user1)
          .buyTokens(amount, { value: ether(10) });
        result = await transaction.wait();
      });

      it("transfers tokens", async () => {
        expect(await token.balanceOf(crowdsale.getAddress())).to.equal(
          tokens(999990)
        );
        expect(await token.balanceOf(user1.address)).to.equal(amount);
      });

      it("update contract's ether balance", async () => {
        expect(
          await ethers.provider.getBalance(crowdsale.getAddress())
        ).to.equal(amount);
      });

      it("updates tokens sold", async () => {
        expect(await crowdsale.tokensSold()).to.equal(amount);
      });

      it("emits a buy event", async () => {
        await expect(transaction)
          .to.emit(crowdsale, "Buy")
          .withArgs(amount, await user1.getAddress());
      });
    });

    describe("Failure", async () => {
      it("rejects insufficient ETH", async () => {
        await expect(
          crowdsale.connect(user1).buyTokens(tokens(10), { value: 0 })
        ).to.be.reverted;
      });
    });
  });
});
