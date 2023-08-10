// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the ERC20 token interface
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Bounty {
    address public owner; // Address of the platform owner
    IERC20 public token; // Address of the ERC20 token (e.g., USDT)
    uint256 public platformFeePercentage = 10; // 10% platform fee
    uint256 public minimumBountyAmount = 1 ether; // Minimum bounty amount (1 USDT)

    struct Bounty {
        address creator;
        string title;
        string descriptionMeta;
        string descriptionIPFSHash;
        uint256 creationDate;
        uint256 targetCompletionDate;
        uint256 amount;
        bool isOpen;
        bool isCancelled;
        bool isCompleted;
        address acceptedSubmission;
    }

    Bounty[] public bounties;
    mapping(address => uint256[]) public creatorBounties;

    event BountyCreated(uint256 bountyId, address creator, uint256 amount);

    event BountyCancelled(uint256 bountyId);

    event SubmissionAccepted(
        uint256 bountyId,
        address submitter,
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

    modifier isValidBounty(uint256 bountyId) {
        require(bountyId < bounties.length, "Invalid bounty ID");
        require(!bounties[bountyId].isCancelled, "Bounty is already cancelled");
        _;
    }

    // Create a new bounty
    function createBounty(
        string memory _title,
        string memory _descriptionMeta,
        string memory _descriptionIPFSHash,
        uint256 _targetCompletionDate,
        uint256 _amount
    ) external payable {
        require(
            _amount >= minimumBountyAmount,
            "Bounty amount must be at least 1 USDT"
        );

        // Transfer the amount from the user to the contract
        require(
            token.transferFrom(msg.sender, address(this), _amount),
            "Bounty fee deposit failed"
        );

        Bounty memory newBounty = Bounty({
            creator: msg.sender,
            title: _title,
            descriptionMeta: _descriptionMeta,
            descriptionIPFSHash: _descriptionIPFSHash,
            creationDate: block.timestamp,
            targetCompletionDate: _targetCompletionDate,
            amount: _amount,
            isOpen: true,
            isCancelled: false,
            isCompleted: false,
            acceptedSubmission: address(0)
        });

        uint256 bountyId = bounties.length;
        bounties.push(newBounty);
        creatorBounties[msg.sender].push(bountyId);

        emit BountyCreated(bountyId, msg.sender, _amount);
    }

    // Get bounty details
    function getBounty(uint256 bountyId)
        external
        view
        isValidBounty(bountyId)
        returns (
            address creator,
            string memory title,
            string memory descriptionMeta,
            string memory descriptionIPFSHash,
            uint256 creationDate,
            uint256 targetCompletionDate,
            uint256 amount,
            bool isOpen,
            bool isCancelled,
            bool isCompleted,
            address acceptedSubmission
        )
    {
        Bounty storage bounty = bounties[bountyId];
        return (
            bounty.creator,
            bounty.title,
            bounty.descriptionMeta,
            bounty.descriptionIPFSHash,
            bounty.creationDate,
            bounty.targetCompletionDate,
            bounty.amount,
            bounty.isOpen,
            bounty.isCancelled,
            bounty.isCompleted,
            bounty.acceptedSubmission
        );
    }

    // Update a bounty
    function updateBounty(
        uint256 bountyId,
        string memory _title,
        string memory _descriptionMeta,
        string memory _descriptionIPFSHash,
        uint256 _targetCompletionDate
    ) external isValidBounty(bountyId) {
        Bounty storage bounty = bounties[bountyId];
        require(
            msg.sender == bounty.creator,
            "Only the creator can update the bounty"
        );
        require(bounty.isOpen, "Bounty is already closed");

        bounty.title = _title;
        bounty.descriptionMeta = _descriptionMeta;
        bounty.descriptionIPFSHash = _descriptionIPFSHash;
        bounty.targetCompletionDate = _targetCompletionDate;
    }

    // Cancel a bounty
    function cancelBounty(uint256 bountyId) external isValidBounty(bountyId) {
        Bounty storage bounty = bounties[bountyId];
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

        emit BountyCancelled(bountyId);
    }

    // Accept a submission
    function acceptSubmission(uint256 bountyId, address submitter)
        external
        isValidBounty(bountyId)
    {
        Bounty storage bounty = bounties[bountyId];
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

        emit SubmissionAccepted(bountyId, submitter, rewardAmount);
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
