// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Bounty.sol";

contract BountyFactory {
    IERC20 public token; // cUSD token contract
    address[] public bounties;

    event BountyCreated(
        address indexed creator,
        address bountyAddress,
        string description,
        uint reward
    );

    constructor(address _token) {
        token = IERC20(_token);
    }

    function createBounty(
        string memory _bountyMetadata,
        uint _reward,
        string memory _communicationMethod,
        string memory _communicationValue,
        uint _deadline
    ) external {
        require(_reward > 0, "Reward must be greater than 0");
        require(
            token.transferFrom(msg.sender, address(this), _reward),
            "Token transfer failed"
        );

        Bounty newBounty = new Bounty(
            address(token),
            msg.sender,
            _bountyMetadata,
            _reward,
            _communicationMethod,
            _communicationValue,
            _deadline
        );
        bounties.push(address(newBounty));

        emit BountyCreated(
            msg.sender,
            address(newBounty),
            _bountyMetadata,
            _reward
        );

        // Transfer the reward to the new bounty contract
        require(
            token.transfer(address(newBounty), _reward),
            "Token transfer to bounty contract failed"
        );
    }

    function getBounties() external view returns (address[] memory) {
        return bounties;
    }
}
