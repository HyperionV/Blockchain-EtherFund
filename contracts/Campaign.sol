// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Campaign
 * @dev Individual crowdfunding campaign contract
 */
contract Campaign is ReentrancyGuard, Ownable {
    uint256 public goalAmount;
    uint256 public deadline;
    uint256 public totalRaised;
    bool public goalReached;
    bool public fundsWithdrawn;
    
    mapping(address => uint256) public contributions;
    address[] public contributors;
    
    event ContributionMade(address indexed contributor, uint256 amount);
    event WithdrawalMade(address indexed creator, uint256 amount);
    event RefundClaimed(address indexed contributor, uint256 amount);
    event GoalReached(uint256 totalRaised);
    
    constructor(
        address _creator,
        uint256 _goalAmount,
        uint256 _deadline
    ) Ownable(_creator) {
        require(_goalAmount > 0, "Goal amount must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        
        goalAmount = _goalAmount;
        deadline = _deadline;
        goalReached = false;
        fundsWithdrawn = false;
    }
    
    /**
     * @dev Allow users to contribute ETH to the campaign
     */
    function contribute() external payable nonReentrant {
        require(block.timestamp < deadline, "Campaign has ended");
        require(!goalReached, "Campaign goal already reached");
        require(msg.value > 0, "Contribution must be greater than 0");
        
        if (contributions[msg.sender] == 0) {
            contributors.push(msg.sender);
        }
        
        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;
        
        if (totalRaised >= goalAmount) {
            goalReached = true;
            emit GoalReached(totalRaised);
        }
        
        emit ContributionMade(msg.sender, msg.value);
    }
    
    /**
     * @dev Allow creator to withdraw funds if goal is reached
     */
    function withdraw() external onlyOwner nonReentrant {
        require(goalReached, "Goal not reached");
        require(!fundsWithdrawn, "Funds already withdrawn");
        require(block.timestamp >= deadline || totalRaised >= goalAmount, "Cannot withdraw yet");
        
        fundsWithdrawn = true;
        uint256 amount = address(this).balance;
        
        (bool success, ) = owner().call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit WithdrawalMade(owner(), amount);
    }
    
    /**
     * @dev Allow contributors to claim refunds if goal not reached
     */
    function refund() external nonReentrant {
        require(block.timestamp >= deadline, "Campaign not ended yet");
        require(!goalReached, "Goal was reached, no refunds");
        require(contributions[msg.sender] > 0, "No contribution to refund");
        
        uint256 refundAmount = contributions[msg.sender];
        contributions[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: refundAmount}("");
        require(success, "Refund failed");
        
        emit RefundClaimed(msg.sender, refundAmount);
    }
    
    /**
     * @dev Get campaign details
     */
    function getCampaignDetails() external view returns (
        address creator,
        uint256 _goalAmount,
        uint256 _deadline,
        uint256 _totalRaised,
        bool _goalReached,
        bool _fundsWithdrawn,
        uint256 contributorCount
    ) {
        return (
            owner(),
            goalAmount,
            deadline,
            totalRaised,
            goalReached,
            fundsWithdrawn,
            contributors.length
        );
    }
    
    /**
     * @dev Get contributor count
     */
    function getContributorCount() external view returns (uint256) {
        return contributors.length;
    }
    
    /**
     * @dev Get contribution amount for a specific address
     */
    function getContribution(address contributor) external view returns (uint256) {
        return contributions[contributor];
    }
    
    /**
     * @dev Check if campaign is active
     */
    function isActive() external view returns (bool) {
        return block.timestamp < deadline && !goalReached;
    }
}

