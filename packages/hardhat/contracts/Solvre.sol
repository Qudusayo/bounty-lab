// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IERC20.sol";

contract Solvre {
    address public owner; // Address of the platform owner
    IERC20 public token; // Address of the ERC20 token (e.g., USDT)
    uint256 public platformFeePercentage = 10; // 10% platform fee
    uint256 public minimumBountyAmount = 1 ether; // Minimum bounty amount (1 USDT)

    struct Bounty {
        address creator;
        uint256 amount;
        bool isOpen;
        bool isCancelled;
        bool isCompleted;
        address acceptedSubmission;
    }

    mapping(string => Bounty) public bounties;

    event BountyOpened(string bountyId, address creator, uint256 amount);
    event BountyCancelled(string bountyId);
    event BountyCompleted(
        string bountyId,
        address hunter,
        uint256 rewardAmount
    );

    constructor(address _tokenAddress) {
        owner = msg.sender;
        token = IERC20(_tokenAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier isValidBounty(string memory _bountyId) {
        require(
            !bounties[_bountyId].isCancelled,
            "Bounty is already cancelled"
        );
        _;
    }

    // Create a new bounty
    function createBounty(string memory _bountyId, uint256 _amount)
        external
        payable
    {
        require(
            _amount >= minimumBountyAmount,
            "Bounty amount must be at least 1 CUSD"
        );

        // Transfer the amount from the user to the contract
        require(
            token.transferFrom(msg.sender, address(this), _amount),
            "Bounty fee deposit failed"
        );

        Bounty memory newBounty = Bounty({
            creator: msg.sender,
            amount: _amount,
            isOpen: true,
            isCancelled: false,
            isCompleted: false,
            acceptedSubmission: address(0)
        });

        bounties[_bountyId] = newBounty;

        emit BountyOpened(_bountyId, msg.sender, _amount);
    }

    // Get bounty details
    function getBounty(string memory _bountyId)
        external
        view
        isValidBounty(_bountyId)
        returns (
            address creator,
            uint256 amount,
            bool isOpen,
            bool isCancelled,
            bool isCompleted,
            address acceptedSubmission
        )
    {
        Bounty storage bounty = bounties[_bountyId];
        return (
            bounty.creator,
            bounty.amount,
            bounty.isOpen,
            bounty.isCancelled,
            bounty.isCompleted,
            bounty.acceptedSubmission
        );
    }

    // Cancel a bounty
    function cancelBounty(string memory _bountyId)
        external
        isValidBounty(_bountyId)
    {
        Bounty storage bounty = bounties[_bountyId];
        require(
            msg.sender == bounty.creator,
            "Only the creator can cancel the bounty"
        );
        require(bounty.isOpen, "Bounty is already closed");

        bounty.isOpen = false;
        bounty.isCancelled = true;

        // Transfer the bounty amount back to the creator
        require(
            token.transfer(bounty.creator, bounty.amount),
            "Bounty refund failed"
        );

        emit BountyCancelled(_bountyId);
    }

    // Accept a submission
    function acceptSubmission(string memory _bountyId, address submitter)
        external
        isValidBounty(_bountyId)
    {
        Bounty storage bounty = bounties[_bountyId];
        require(
            msg.sender == bounty.creator,
            "Only the creator can accept the bounty"
        );
        require(bounty.isOpen, "Bounty is already closed");
        require(
            bounty.acceptedSubmission == address(0),
            "Bounty already accepted"
        );

        bounty.isOpen = false;
        bounty.isCompleted = true;
        bounty.acceptedSubmission = submitter;

        // Calculate the reward amount
        uint256 rewardAmount = (bounty.amount * (100 - platformFeePercentage)) /
            100;

        // Transfer the reward amount to the submitter
        require(
            token.transfer(submitter, rewardAmount),
            "Reward transfer failed"
        );

        // Transfer the platform fee to the owner
        require(
            token.transfer(owner, bounty.amount - rewardAmount),
            "Platform fee transfer failed"
        );

        emit BountyCompleted(_bountyId, submitter, rewardAmount);
    }

    function setPlatformFeePercentage(uint256 _feePercentage)
        external
        onlyOwner
    {
        require(_feePercentage <= 100, "Fee percentage cannot exceed 100");
        platformFeePercentage = _feePercentage;
    }

    function setMinimumBountyAmount(uint256 _minimumAmount) external onlyOwner {
        minimumBountyAmount = _minimumAmount;
    }
}
