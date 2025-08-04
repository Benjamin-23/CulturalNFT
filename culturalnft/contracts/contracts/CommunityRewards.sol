// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./CulturalNFT.sol";

/**
 * @title CommunityRewards
 * @dev Manages community rewards and point system
 */
contract CommunityRewards is Ownable, ReentrancyGuard {
    struct UserProfile {
        uint256 totalPoints;
        uint256 likesGiven;
        uint256 nftsOwned;
        uint256 totalContributed;
        uint256 joinTimestamp;
        RewardTier currentTier;
    }

    enum RewardTier {
        Bronze, // 1,000 points
        Silver, // 5,000 points
        Gold, // 15,000 points
        Diamond // 25,000 points
    }

    struct RewardDistribution {
        uint256 tokenId;
        uint256 totalAmount;
        uint256 distributedAmount;
        uint256 timestamp;
        bool isActive;
    }

    // Mapping from user address to profile
    mapping(address => UserProfile) public userProfiles;

    // Mapping from user to token to like timestamp
    mapping(address => mapping(uint256 => uint256)) public userLikeHistory;

    // Mapping from reward distribution ID to details
    mapping(uint256 => RewardDistribution) public rewardDistributions;

    // Points required for each tier
    mapping(RewardTier => uint256) public tierRequirements;

    // Discount percentages for each tier (in basis points)
    mapping(RewardTier => uint256) public tierDiscounts;

    uint256 private _distributionIdCounter;

    // Reference to NFT contract
    CulturalNFT public nftContract;

    // Points per action
    uint256 public constant POINTS_PER_LIKE = 10;
    uint256 public constant POINTS_PER_PURCHASE = 100;
    uint256 public constant POINTS_PER_AUCTION_WIN = 200;
    uint256 public constant POINTS_PER_REFERRAL = 500;

    event PointsEarned(address indexed user, uint256 points, string action);
    event TierUpgraded(address indexed user, RewardTier newTier);
    event RewardClaimed(address indexed user, uint256 amount);
    event CommunityRewardDistributed(uint256 indexed tokenId, uint256 amount);

    constructor(address _nftContract) {
        nftContract = CulturalNFT(_nftContract);

        // Set tier requirements
        tierRequirements[RewardTier.Bronze] = 1000;
        tierRequirements[RewardTier.Silver] = 5000;
        tierRequirements[RewardTier.Gold] = 15000;
        tierRequirements[RewardTier.Diamond] = 25000;

        // Set tier discounts (in basis points)
        tierDiscounts[RewardTier.Bronze] = 500; // 5%
        tierDiscounts[RewardTier.Silver] = 1000; // 10%
        tierDiscounts[RewardTier.Gold] = 1500; // 15%
        tierDiscounts[RewardTier.Diamond] = 2000; // 20%
    }

    /**
     * @dev Record like action and award points
     */
    function recordLike(address user, uint256 tokenId) external {
        require(
            msg.sender == address(nftContract),
            "Only NFT contract can call"
        );
        require(userLikeHistory[user][tokenId] == 0, "Already recorded");

        userLikeHistory[user][tokenId] = block.timestamp;

        UserProfile storage profile = userProfiles[user];
        if (profile.joinTimestamp == 0) {
            profile.joinTimestamp = block.timestamp;
        }

        profile.totalPoints += POINTS_PER_LIKE;
        profile.likesGiven++;
        profile.totalContributed += 1 ether; // 1 HBAR

        _checkTierUpgrade(user);

        emit PointsEarned(user, POINTS_PER_LIKE, "like");
    }

    /**
     * @dev Record NFT purchase and award points
     */
    function recordPurchase(
        address user,
        uint256 /*tokenId*/,
        uint256 /*amount*/
    ) external {
        require(
            msg.sender == address(nftContract) || msg.sender == owner(),
            "Unauthorized"
        );

        UserProfile storage profile = userProfiles[user];
        if (profile.joinTimestamp == 0) {
            profile.joinTimestamp = block.timestamp;
        }

        profile.totalPoints += POINTS_PER_PURCHASE;
        profile.nftsOwned++;

        _checkTierUpgrade(user);

        emit PointsEarned(user, POINTS_PER_PURCHASE, "purchase");
    }

    /**
     * @dev Record auction win and award points
     */
    function recordAuctionWin(
        address user,
        uint256 /*tokenId*/,
        uint256 /*amount*/
    ) external {
        require(msg.sender == owner(), "Only owner can call");

        UserProfile storage profile = userProfiles[user];
        if (profile.joinTimestamp == 0) {
            profile.joinTimestamp = block.timestamp;
        }

        profile.totalPoints += POINTS_PER_AUCTION_WIN;
        profile.nftsOwned++;

        _checkTierUpgrade(user);

        emit PointsEarned(user, POINTS_PER_AUCTION_WIN, "auction_win");
    }

    /**
     * @dev Record referral and award points
     */
    function recordReferral(address referrer, address referred) external {
        require(msg.sender == owner(), "Only owner can call");
        require(
            userProfiles[referred].joinTimestamp > 0,
            "Referred user not active"
        );

        UserProfile storage profile = userProfiles[referrer];
        profile.totalPoints += POINTS_PER_REFERRAL;

        _checkTierUpgrade(referrer);

        emit PointsEarned(referrer, POINTS_PER_REFERRAL, "referral");
    }

    /**
     * @dev Get user's current tier
     */
    function getUserTier(address user) public view returns (RewardTier) {
        uint256 points = userProfiles[user].totalPoints;

        if (points >= tierRequirements[RewardTier.Diamond]) {
            return RewardTier.Diamond;
        } else if (points >= tierRequirements[RewardTier.Gold]) {
            return RewardTier.Gold;
        } else if (points >= tierRequirements[RewardTier.Silver]) {
            return RewardTier.Silver;
        } else if (points >= tierRequirements[RewardTier.Bronze]) {
            return RewardTier.Bronze;
        }

        return RewardTier.Bronze; // Default tier
    }

    /**
     * @dev Get discount percentage for user's tier
     */
    function getUserDiscount(address user) public view returns (uint256) {
        RewardTier tier = getUserTier(user);
        return tierDiscounts[tier];
    }

    /**
     * @dev Get user profile
     */
    function getUserProfile(
        address user
    ) public view returns (UserProfile memory) {
        UserProfile memory profile = userProfiles[user];
        profile.currentTier = getUserTier(user);
        return profile;
    }

    /**
     * @dev Check if user has liked a specific token
     */
    function hasUserLikedToken(
        address user,
        uint256 tokenId
    ) public view returns (bool) {
        return userLikeHistory[user][tokenId] > 0;
    }

    /**
     * @dev Get user's like history for a token
     */
    function getUserLikeTimestamp(
        address user,
        uint256 tokenId
    ) public view returns (uint256) {
        return userLikeHistory[user][tokenId];
    }

    /**
     * @dev Distribute community rewards to popular artworks
     */
    function distributeRewards(
        uint256[] calldata tokenIds,
        uint256[] calldata amounts
    ) external payable onlyOwner {
        require(tokenIds.length == amounts.length, "Arrays length mismatch");
        require(msg.value > 0, "No rewards to distribute");

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        require(msg.value >= totalAmount, "Insufficient reward amount");

        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 distributionId = _distributionIdCounter++;

            rewardDistributions[distributionId] = RewardDistribution({
                tokenId: tokenIds[i],
                totalAmount: amounts[i],
                distributedAmount: 0,
                timestamp: block.timestamp,
                isActive: true
            });

            // Send reward to token owner
            address tokenOwner = nftContract.ownerOf(tokenIds[i]);
            (bool success, ) = tokenOwner.call{value: amounts[i]}("");
            require(success, "Reward distribution failed");

            rewardDistributions[distributionId].distributedAmount = amounts[i];

            emit CommunityRewardDistributed(tokenIds[i], amounts[i]);
        }
    }

    /**
     * @dev Internal function to check and upgrade user tier
     */
    function _checkTierUpgrade(address user) internal {
        RewardTier currentTier = userProfiles[user].currentTier;
        RewardTier newTier = getUserTier(user);

        if (newTier > currentTier) {
            userProfiles[user].currentTier = newTier;
            emit TierUpgraded(user, newTier);
        }
    }

    /**
     * @dev Update tier requirements (only owner)
     */
    function updateTierRequirement(
        RewardTier tier,
        uint256 points
    ) external onlyOwner {
        tierRequirements[tier] = points;
    }

    /**
     * @dev Update tier discount (only owner)
     */
    function updateTierDiscount(
        RewardTier tier,
        uint256 discount
    ) external onlyOwner {
        require(discount <= 2500, "Discount cannot exceed 25%"); // 2500 basis points = 25%
        tierDiscounts[tier] = discount;
    }

    /**
     * @dev Emergency withdraw (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // Receive function to accept HBAR
    receive() external payable {}
}
