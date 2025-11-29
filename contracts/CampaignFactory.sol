// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Campaign.sol";

/**
 * @title CampaignFactory
 * @dev Factory contract for deploying Campaign instances
 */
contract CampaignFactory {
    Campaign[] public campaigns;
    mapping(address => Campaign[]) public creatorCampaigns;
    
    event CampaignCreated(
        address indexed creator,
        address indexed campaignAddress,
        uint256 goalAmount,
        uint256 deadline
    );
    
    /**
     * @dev Create a new campaign
     * @param _goalAmount The funding goal in Wei
     * @param _deadline Unix timestamp of campaign deadline
     * @return campaignAddress The address of the newly created campaign
     */
    function createCampaign(
        uint256 _goalAmount,
        uint256 _deadline
    ) external returns (address campaignAddress) {
        Campaign newCampaign = new Campaign(
            msg.sender,
            _goalAmount,
            _deadline
        );
        
        campaigns.push(newCampaign);
        creatorCampaigns[msg.sender].push(newCampaign);
        
        emit CampaignCreated(
            msg.sender,
            address(newCampaign),
            _goalAmount,
            _deadline
        );
        
        return address(newCampaign);
    }
    
    /**
     * @dev Get total number of campaigns
     */
    function getCampaignCount() external view returns (uint256) {
        return campaigns.length;
    }
    
    /**
     * @dev Get all campaigns created by a specific creator
     */
    function getCreatorCampaigns(address creator) external view returns (Campaign[] memory) {
        return creatorCampaigns[creator];
    }
    
    /**
     * @dev Get campaign at specific index
     */
    function getCampaign(uint256 index) external view returns (address) {
        require(index < campaigns.length, "Index out of bounds");
        return address(campaigns[index]);
    }
}

