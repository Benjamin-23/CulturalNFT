// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title CulturalNFT
 * @dev NFT contract for cultural artworks with royalty support
 */
contract CulturalNFT is
    ERC721,
    ERC721URIStorage,
    ERC721Royalty,
    Ownable,
    ReentrancyGuard
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // Mapping from token ID to cultural metadata
    mapping(uint256 => CulturalMetadata) public culturalData;

    // Mapping from token ID to like count
    mapping(uint256 => uint256) public tokenLikes;

    // Mapping from user to token to like status
    mapping(address => mapping(uint256 => bool)) public userLikes;

    // Mapping from token ID to total HBAR received from likes
    mapping(uint256 => uint256) public tokenLikeRewards;

    // Community wallet address
    address public communityWallet;

    // Platform fee percentage (in basis points, e.g., 250 = 2.5%)
    uint256 public platformFeePercent = 250;

    struct CulturalMetadata {
        string culture;
        string artist;
        string story;
        uint256 mintTimestamp;
        bool isActive;
    }

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed artist,
        string culture,
        string tokenURI,
        uint96 royaltyPercent
    );

    event ArtworkLiked(
        uint256 indexed tokenId,
        address indexed liker,
        uint256 amount,
        uint256 totalLikes
    );

    event CommunityRewardDistributed(
        uint256 indexed tokenId,
        address indexed artist,
        uint256 amount
    );

    constructor(address _communityWallet) ERC721("Cultural NFT", "CNFT") {
        communityWallet = _communityWallet;
    }

    /**
     * @dev Mint a new cultural NFT
     */
    function mintCulturalNFT(
        address to,
        string memory _tokenURI,
        string memory culture,
        string memory artist,
        string memory story,
        uint96 royaltyPercent
    ) public payable nonReentrant returns (uint256) {
        require(bytes(culture).length > 0, "Culture cannot be empty");
        require(bytes(artist).length > 0, "Artist cannot be empty");
        require(royaltyPercent <= 2000, "Royalty cannot exceed 20%"); // 2000 basis points = 20%

        // Check minting fee (3 HBAR equivalent in wei)
        uint256 mintingFee = 3 * 10 ** 18; // 3 HBAR in wei
        require(msg.value >= mintingFee, "Insufficient minting fee");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        _setTokenRoyalty(tokenId, to, royaltyPercent);

        culturalData[tokenId] = CulturalMetadata({
            culture: culture,
            artist: artist,
            story: story,
            mintTimestamp: block.timestamp,
            isActive: true
        });

        // Send minting fee to community wallet
        (bool success, ) = communityWallet.call{value: msg.value}("");
        require(success, "Failed to send minting fee");

        emit NFTMinted(tokenId, to, culture, _tokenURI, royaltyPercent);

        return tokenId;
    }

    /**
     * @dev Like an artwork and send HBAR to community pool
     */
    function likeArtwork(uint256 tokenId) public payable nonReentrant {
        require(_exists(tokenId), "Token does not exist");
        require(!userLikes[msg.sender][tokenId], "Already liked this artwork");
        require(msg.value >= 1 * 10 ** 18, "Must send at least 1 HBAR"); // 1 HBAR in wei

        userLikes[msg.sender][tokenId] = true;
        tokenLikes[tokenId]++;
        tokenLikeRewards[tokenId] += msg.value;

        // Send like payment to community wallet
        (bool success, ) = communityWallet.call{value: msg.value}("");
        require(success, "Failed to send like payment");

        emit ArtworkLiked(tokenId, msg.sender, msg.value, tokenLikes[tokenId]);
    }

    /**
     * @dev Get cultural metadata for a token
     */
    function getCulturalData(
        uint256 tokenId
    ) public view returns (CulturalMetadata memory) {
        require(_exists(tokenId), "Token does not exist");
        return culturalData[tokenId];
    }

    /**
     * @dev Get like statistics for a token
     */
    function getLikeStats(
        uint256 tokenId
    ) public view returns (uint256 likes, uint256 rewards) {
        require(_exists(tokenId), "Token does not exist");
        return (tokenLikes[tokenId], tokenLikeRewards[tokenId]);
    }

    /**
     * @dev Check if user has liked a token
     */
    function hasUserLiked(
        address user,
        uint256 tokenId
    ) public view returns (bool) {
        return userLikes[user][tokenId];
    }

    /**
     * @dev Get total number of minted tokens
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    /**
     * @dev Update community wallet (only owner)
     */
    function updateCommunityWallet(address _newWallet) public onlyOwner {
        require(_newWallet != address(0), "Invalid wallet address");
        communityWallet = _newWallet;
    }

    /**
     * @dev Update platform fee (only owner)
     */
    function updatePlatformFee(uint256 _newFeePercent) public onlyOwner {
        require(_newFeePercent <= 1000, "Fee cannot exceed 10%"); // 1000 basis points = 10%
        platformFeePercent = _newFeePercent;
    }

    // Override functions for multiple inheritance
    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage, ERC721Royalty) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Royalty)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
