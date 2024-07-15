// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Bounty {
    IERC20 public token; // cUSD token contract
    address public creator;
    string public description;
    uint256 public reward;
    bool public isOpen;
    bool public isCompleted;
    bool public isCancelled;
    bool public isSubmitted;
    bool public isRequestChange;
    address public acceptedApplicant;
    string public communicationMethod;
    string private communicationValue;
    uint256 public createdAt;
    uint256 public deadline;

    event ApplicationSubmitted(
        address indexed applicant,
        string applicationText
    );
    event ApplicantAccepted(address indexed applicant);
    event ApplicantRejected(address indexed applicant);
    event SubmissionMade(address indexed applicant, string submission);
    event BountyPaid(address indexed applicant, uint256 reward);
    event BountyClosed(address indexed creator);

    struct Application {
        address applicant;
        string applicationText;
        uint256 applicationDate;
        bool isAccepted;
        bool isRejected;
        string communicationValue;
    }

    Application[] public applications;

    struct Submission {
        address applicant;
        string submission;
        bool isSubmission;
        bool isReqestChange;
    }

    Submission[] public submissions;

    modifier onlyCreator() {
        require(
            msg.sender == creator,
            "Only the bounty creator can perform this action"
        );
        _;
    }

    modifier onlyWhenOpen() {
        require(isOpen, "Bounty is not open for applications");
        require(!isCancelled, "Bounty is cancelled");
        _;
    }

    constructor(
        address _token,
        address _creator,
        string memory _description,
        uint256 _reward,
        string memory _communicationMethod,
        string memory _communicationValue,
        uint256 _deadline
    ) {
        token = IERC20(_token);
        creator = _creator;
        description = _description;
        reward = _reward;
        isOpen = true;
        isCompleted = false;
        isCancelled = false;
        communicationMethod = _communicationMethod;
        communicationValue = _communicationValue;
        createdAt = block.timestamp;
        deadline = _deadline;
    }

    function getApplications() external view returns (Application[] memory) {
        return applications;
    }

    function getApplication(
        uint256 _index
    ) external view returns (Application memory) {
        require(_index < applications.length, "Invalid application index");
        return applications[_index];
    }

    function getCommunicationValue() external view returns (string memory) {
        return communicationValue;
    }

    function submitApplication(
        string memory _applicationText,
        string memory _communicationValue
    ) external onlyWhenOpen {
        require(
            acceptedApplicant == address(0),
            "An applicant has already been accepted"
        );

        applications.push(
            Application({
                applicant: msg.sender,
                applicationText: _applicationText,
                applicationDate: block.timestamp,
                isAccepted: false,
                isRejected: false,
                communicationValue: _communicationValue
            })
        );

        emit ApplicationSubmitted(msg.sender, _applicationText);
    }

    function acceptApplicant(
        uint256 _applicationIndex
    ) external onlyCreator onlyWhenOpen {
        require(
            _applicationIndex < applications.length,
            "Invalid application index"
        );

        acceptedApplicant = applications[_applicationIndex].applicant;
        applications[_applicationIndex].isAccepted = true;
        isOpen = false;

        emit ApplicantAccepted(acceptedApplicant);
    }

    function rejectApplicant(
        uint256 _applicationIndex
    ) external onlyCreator onlyWhenOpen {
        require(
            _applicationIndex < applications.length,
            "Invalid application index"
        );

        applications[_applicationIndex].isRejected = true;

        emit ApplicantRejected(acceptedApplicant);
    }

    function submitBounty(
        string memory _submission,
        bool _isRequestChange,
        bool _isSubmission
    ) external {
        require(!isCancelled, "Bounty is cancelled");
        require(
            msg.sender == acceptedApplicant,
            "Only the accepted applicant can submit the bounty"
        );
        require(!isCompleted, "Bounty is already completed");

        submissions.push(
            Submission({
                applicant: msg.sender,
                submission: _submission,
                isSubmission: _isSubmission,
                isReqestChange: isRequestChange
            })
        );

        if (_isSubmission) {
            isSubmitted = true;
            isRequestChange = false;
        }

        if (_isRequestChange) {
            isSubmitted = false;
            isRequestChange = true;
        }

        emit SubmissionMade(msg.sender, _submission);
    }

    function abandonBounty() external {
        require(
            msg.sender == acceptedApplicant,
            "Only the accepted applicant can abandon the bounty"
        );
        require(!isCancelled, "Bounty is cancelled");

        isOpen = true;
        isSubmitted = false;
        isRequestChange = false;

        acceptedApplicant = address(0);
        for (uint256 i = 0; i < applications.length; i++) {
            if (applications[i].applicant == msg.sender) {
                applications[i].isRejected = true;
            }
        }

        emit BountyClosed(msg.sender);
    }

    function getSubmissions() external view returns (Submission[] memory) {
        return submissions;
    }

    function reviewSubmission(bool _accept) external onlyCreator {
        require(!isCancelled, "Bounty is cancelled");
        require(isSubmitted, "Bounty is not yet submitted");

        if (_accept) {
            require(
                token.transfer(acceptedApplicant, reward),
                "Token transfer failed"
            );
            emit BountyPaid(acceptedApplicant, reward);
            isCompleted = true;
        } else {
            isCompleted = false; // Reset to allow resubmission
        }
    }

    function closeBounty() external onlyCreator onlyWhenOpen {
        require(
            acceptedApplicant == address(0),
            "Cannot close the bounty after accepting an applicant"
        );

        isOpen = false;
        isCancelled = true;

        emit BountyClosed(msg.sender);

        // Refund the bounty reward to the creator
        require(token.transfer(creator, reward), "Token transfer failed");
    }
}
