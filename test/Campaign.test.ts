import { expect } from "chai";
import { ethers } from "hardhat";
import { Campaign, CampaignFactory } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Campaign", function () {
  let campaign: Campaign;
  let factory: CampaignFactory;
  let owner: HardhatEthersSigner;
  let contributor1: HardhatEthersSigner;
  let contributor2: HardhatEthersSigner;
  let goalAmount: bigint;
  let deadline: bigint;

  beforeEach(async function () {
    [owner, contributor1, contributor2] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("CampaignFactory");
    factory = await Factory.deploy();

    goalAmount = ethers.parseEther("10");
    deadline = BigInt(Math.floor(Date.now() / 1000) + 86400); // 24 hours from now

    const tx = await factory.createCampaign(goalAmount, deadline);
    const receipt = await tx.wait();
    
    const event = receipt?.logs.find(
      (log: any) => log.fragment?.name === "CampaignCreated"
    );
    const campaignAddress = event?.args[1];
    
    campaign = await ethers.getContractAt("Campaign", campaignAddress);
  });

  describe("Deployment", function () {
    it("Should set the correct goal amount", async function () {
      expect(await campaign.goalAmount()).to.equal(goalAmount);
    });

    it("Should set the correct deadline", async function () {
      expect(await campaign.deadline()).to.equal(deadline);
    });

    it("Should set owner as creator", async function () {
      expect(await campaign.owner()).to.equal(owner.address);
    });

    it("Should reject zero goal amount", async function () {
      await expect(
        factory.createCampaign(0, deadline)
      ).to.be.revertedWith("Goal amount must be greater than 0");
    });

    it("Should reject past deadline", async function () {
      const pastDeadline = BigInt(Math.floor(Date.now() / 1000) - 3600);
      await expect(
        factory.createCampaign(goalAmount, pastDeadline)
      ).to.be.revertedWith("Deadline must be in the future");
    });
  });

  describe("Contributions", function () {
    it("Should accept contributions", async function () {
      const contribution = ethers.parseEther("1");
      await expect(
        campaign.connect(contributor1).contribute({ value: contribution })
      )
        .to.emit(campaign, "ContributionMade")
        .withArgs(contributor1.address, contribution);

      expect(await campaign.contributions(contributor1.address)).to.equal(contribution);
      expect(await campaign.totalRaised()).to.equal(contribution);
    });

    it("Should track multiple contributors", async function () {
      const contribution1 = ethers.parseEther("2");
      const contribution2 = ethers.parseEther("3");

      await campaign.connect(contributor1).contribute({ value: contribution1 });
      await campaign.connect(contributor2).contribute({ value: contribution2 });

      expect(await campaign.getContributorCount()).to.equal(2);
      expect(await campaign.totalRaised()).to.equal(contribution1 + contribution2);
    });

    it("Should allow multiple contributions from same address", async function () {
      const contribution1 = ethers.parseEther("1");
      const contribution2 = ethers.parseEther("2");

      await campaign.connect(contributor1).contribute({ value: contribution1 });
      await campaign.connect(contributor1).contribute({ value: contribution2 });

      expect(await campaign.contributions(contributor1.address)).to.equal(
        contribution1 + contribution2
      );
      expect(await campaign.getContributorCount()).to.equal(1);
    });

    it("Should reject zero contributions", async function () {
      await expect(
        campaign.connect(contributor1).contribute({ value: 0 })
      ).to.be.revertedWith("Contribution must be greater than 0");
    });

    it("Should reject contributions after deadline", async function () {
      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [86401]);
      await ethers.provider.send("evm_mine", []);

      await expect(
        campaign.connect(contributor1).contribute({ value: ethers.parseEther("1") })
      ).to.be.revertedWith("Campaign has ended");
    });

    it("Should mark goal as reached when total equals goal", async function () {
      await campaign.connect(contributor1).contribute({ value: goalAmount });

      expect(await campaign.goalReached()).to.be.true;
      expect(await campaign.totalRaised()).to.equal(goalAmount);
    });

    it("Should mark goal as reached when total exceeds goal", async function () {
      await campaign.connect(contributor1).contribute({ value: goalAmount + ethers.parseEther("1") });

      expect(await campaign.goalReached()).to.be.true;
    });

    it("Should reject contributions after goal reached", async function () {
      await campaign.connect(contributor1).contribute({ value: goalAmount });

      await expect(
        campaign.connect(contributor2).contribute({ value: ethers.parseEther("1") })
      ).to.be.revertedWith("Campaign goal already reached");
    });
  });

  describe("Withdrawals", function () {
    it("Should allow creator to withdraw when goal reached", async function () {
      await campaign.connect(contributor1).contribute({ value: goalAmount });

      const balanceBefore = await ethers.provider.getBalance(owner.address);
      const tx = await campaign.withdraw();
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      const balanceAfter = await ethers.provider.getBalance(owner.address);

      expect(balanceAfter).to.equal(balanceBefore + goalAmount - gasUsed);
      expect(await campaign.fundsWithdrawn()).to.be.true;
    });

    it("Should reject withdrawal before goal reached", async function () {
      await campaign.connect(contributor1).contribute({ value: ethers.parseEther("5") });

      await expect(campaign.withdraw()).to.be.revertedWith("Goal not reached");
    });

    it("Should reject withdrawal by non-owner", async function () {
      await campaign.connect(contributor1).contribute({ value: goalAmount });

      await expect(
        campaign.connect(contributor1).withdraw()
      ).to.be.revertedWithCustomError(campaign, "OwnableUnauthorizedAccount");
    });

    it("Should prevent double withdrawal", async function () {
      await campaign.connect(contributor1).contribute({ value: goalAmount });
      await campaign.withdraw();

      await expect(campaign.withdraw()).to.be.revertedWith("Funds already withdrawn");
    });
  });

  describe("Refunds", function () {
    it("Should allow refunds after deadline if goal not reached", async function () {
      const contribution = ethers.parseEther("5");
      await campaign.connect(contributor1).contribute({ value: contribution });

      // Fast forward past deadline
      await ethers.provider.send("evm_increaseTime", [86401]);
      await ethers.provider.send("evm_mine", []);

      const balanceBefore = await ethers.provider.getBalance(contributor1.address);
      const tx = await campaign.connect(contributor1).refund();
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      const balanceAfter = await ethers.provider.getBalance(contributor1.address);

      expect(balanceAfter).to.equal(balanceBefore + contribution - gasUsed);
      expect(await campaign.contributions(contributor1.address)).to.equal(0);
    });

    it("Should reject refunds before deadline", async function () {
      await campaign.connect(contributor1).contribute({ value: ethers.parseEther("5") });

      await expect(
        campaign.connect(contributor1).refund()
      ).to.be.revertedWith("Campaign not ended yet");
    });

    it("Should reject refunds if goal was reached", async function () {
      await campaign.connect(contributor1).contribute({ value: goalAmount });

      // Fast forward past deadline
      await ethers.provider.send("evm_increaseTime", [86401]);
      await ethers.provider.send("evm_mine", []);

      await expect(
        campaign.connect(contributor1).refund()
      ).to.be.revertedWith("Goal was reached, no refunds");
    });

    it("Should reject refunds for non-contributors", async function () {
      await ethers.provider.send("evm_increaseTime", [86401]);
      await ethers.provider.send("evm_mine", []);

      await expect(
        campaign.connect(contributor1).refund()
      ).to.be.revertedWith("No contribution to refund");
    });
  });

  describe("Campaign Details", function () {
    it("Should return correct campaign details", async function () {
      const contribution = ethers.parseEther("3");
      await campaign.connect(contributor1).contribute({ value: contribution });

      const details = await campaign.getCampaignDetails();
      expect(details.creator).to.equal(owner.address);
      expect(details._goalAmount).to.equal(goalAmount);
      expect(details._totalRaised).to.equal(contribution);
      expect(details._goalReached).to.be.false;
      expect(details.contributorCount).to.equal(1);
    });

    it("Should correctly identify active campaigns", async function () {
      expect(await campaign.isActive()).to.be.true;

      await campaign.connect(contributor1).contribute({ value: goalAmount });
      expect(await campaign.isActive()).to.be.false;
    });
  });
});

describe("CampaignFactory", function () {
  let factory: CampaignFactory;
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("CampaignFactory");
    factory = await Factory.deploy();
  });

  it("Should create a new campaign", async function () {
    const goalAmount = ethers.parseEther("10");
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 86400);

    await expect(factory.createCampaign(goalAmount, deadline))
      .to.emit(factory, "CampaignCreated")
      .withArgs(owner.address, ethers.anyValue, goalAmount, deadline);

    expect(await factory.getCampaignCount()).to.equal(1);
  });

  it("Should track campaigns by creator", async function () {
    const goalAmount = ethers.parseEther("10");
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 86400);

    await factory.createCampaign(goalAmount, deadline);
    await factory.connect(user).createCampaign(goalAmount, deadline);

    const ownerCampaigns = await factory.getCreatorCampaigns(owner.address);
    const userCampaigns = await factory.getCreatorCampaigns(user.address);

    expect(ownerCampaigns.length).to.equal(1);
    expect(userCampaigns.length).to.equal(1);
  });
});

