// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "./CulturalNFT.sol";

/**
 * @title CulturalMarketplace
 * @dev Marketplace contract for trading cultural NFTs with auction support
 */
contract CulturalMarketplace is ReentrancyGuard, Ownable, ERC721Holder {
    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
        bool isAuction;
        uint256 auctionEndTime;
        address highestBidder;
        uint256 highestBid;
        uint256 minBidIncrement;
    }

    struct Bid {
        address bidder;
        uint256 amount;
        uint256 timestamp;
    }

    // Mapping from listing ID to listing details
    mapping(uint256 => Listing) public listings;

    // Mapping from listing ID to all bids
    mapping(uint256 => Bid[]) public listingBids;

    // Mapping from user to their pending bid amounts (for refunds)
    mapping(address => uint256) public pendingReturns;

    uint256 private _listingIdCounter;

    // Platform fee percentage (in basis points)
    uint256 public platformFeePercent = 250; // 2.5%

    // Community wallet for fees
    address public communityWallet;

    // Reference to the NFT contract
    CulturalNFT public nftContract;

    event ListingCreated(
        uint256 indexed listingId,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price,
        bool isAuction,
        uint256 auctionEndTime
    );

    event BidPlaced(
        uint256 indexed listingId,
        address indexed bidder,
        uint256 amount,
        uint256 timestamp
    );

    event Sale(
        uint256 indexed listingId,
        uint256 indexed tokenId,
        address indexed seller,
        address buyer,
        uint256 price
    );

    event AuctionEnded(
        uint256 indexed listingId,
        address indexed winner,
        uint256 winningBid
    );

    event ListingCancelled(uint256 indexed listingId);

    constructor(address _nftContract, address _communityWallet) {
        nftContract = CulturalNFT(_nftContract);
        communityWallet = _communityWallet;
    }

    /**
     * @dev Create a fixed-price listing
     */
    function createListing(
        uint256 tokenId,
        uint256 price
    ) public nonReentrant returns (uint256) {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not token owner");
        require(price > 0, "Price must be greater than 0");
        require(
            nftContract.isApprovedForAll(msg.sender, address(this)) ||
                nftContract.getApproved(tokenId) == address(this),
            "Contract not approved"
        );

        uint256 listingId = _listingIdCounter++;

        listings[listingId] = Listing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isActive: true,
            isAuction: false,
            auctionEndTime: 0,
            highestBidder: address(0),
            highestBid: 0,
            minBidIncrement: 0
        });

        // Transfer NFT to marketplace
        nftContract.safeTransferFrom(msg.sender, address(this), tokenId);

        emit ListingCreated(listingId, tokenId, msg.sender, price, false, 0);

        return listingId;
    }

    /**
     * @dev Create an auction listing
     */
    function createAuction(
        uint256 tokenId,
        uint256 startingPrice,
        uint256 duration,
        uint256 minBidIncrement
    ) public nonReentrant returns (uint256) {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not token owner");
        require(startingPrice > 0, "Starting price must be greater than 0");
        require(duration > 0, "Duration must be greater than 0");
        require(
            nftContract.isApprovedForAll(msg.sender, address(this)) ||
                nftContract.getApproved(tokenId) == address(this),
            "Contract not approved"
        );

        uint256 listingId = _listingIdCounter++;
        uint256 auctionEndTime = block.timestamp + duration;

        listings[listingId] = Listing({
            tokenId: tokenId,
            seller: msg.sender,
            price: startingPrice,
            isActive: true,
            isAuction: true,
            auctionEndTime: auctionEndTime,
            highestBidder: address(0),
            highestBid: 0,
            minBidIncrement: minBidIncrement
        });

        // Transfer NFT to marketplace
        nftContract.safeTransferFrom(msg.sender, address(this), tokenId);

        emit ListingCreated(
            listingId,
            tokenId,
            msg.sender,
            startingPrice,
            true,
            auctionEndTime
        );

        return listingId;
    }

    /**
     * @dev Buy NFT at fixed price
     */
    function buyNFT(uint256 listingId) public payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing not active");
        require(!listing.isAuction, "This is an auction, use placeBid instead");
        require(msg.value >= listing.price, "Insufficient payment");

        listing.isActive = false;

        // Calculate fees and royalties
        (
            uint256 sellerAmount,
            uint256 platformFee,
            uint256 royaltyAmount,
            address royaltyRecipient
        ) = _calculatePayments(listing.tokenId, listing.price);

        // Transfer NFT to buyer
        nftContract.safeTransferFrom(
            address(this),
            msg.sender,
            listing.tokenId
        );

        // Distribute payments
        _distributePayments(
            listing.seller,
            sellerAmount,
            platformFee,
            royaltyAmount,
            royaltyRecipient
        );

        // Refund excess payment
        if (msg.value > listing.price) {
            (bool success, ) = msg.sender.call{
                value: msg.value - listing.price
            }("");
            require(success, "Refund failed");
        }

        emit Sale(
            listingId,
            listing.tokenId,
            listing.seller,
            msg.sender,
            listing.price
        );
    }

    /**
     * @dev Place bid on auction
     */
    function placeBid(uint256 listingId) public payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing not active");
        require(listing.isAuction, "This is not an auction");
        require(block.timestamp < listing.auctionEndTime, "Auction ended");
        require(msg.value >= listing.price, "Bid below starting price");
        require(
            msg.value >= listing.highestBid + listing.minBidIncrement,
            "Bid increment too low"
        );

        // Refund previous highest bidder
        if (listing.highestBidder != address(0)) {
            pendingReturns[listing.highestBidder] += listing.highestBid;
        }

        listing.highestBidder = msg.sender;
        listing.highestBid = msg.value;

        // Record bid
        listingBids[listingId].push(
            Bid({
                bidder: msg.sender,
                amount: msg.value,
                timestamp: block.timestamp
            })
        );

        emit BidPlaced(listingId, msg.sender, msg.value, block.timestamp);
    }

    /**
     * @dev End auction and transfer NFT to winner
     */
    function endAuction(uint256 listingId) public nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing not active");
        require(listing.isAuction, "This is not an auction");
        require(
            block.timestamp >= listing.auctionEndTime,
            "Auction still active"
        );

        listing.isActive = false;

        if (listing.highestBidder != address(0)) {
            // Calculate fees and royalties
            (
                uint256 sellerAmount,
                uint256 platformFee,
                uint256 royaltyAmount,
                address royaltyRecipient
            ) = _calculatePayments(listing.tokenId, listing.highestBid);

            // Transfer NFT to winner
            nftContract.safeTransferFrom(
                address(this),
                listing.highestBidder,
                listing.tokenId
            );

            // Distribute payments
            _distributePayments(
                listing.seller,
                sellerAmount,
                platformFee,
                royaltyAmount,
                royaltyRecipient
            );

            emit Sale(
                listingId,
                listing.tokenId,
                listing.seller,
                listing.highestBidder,
                listing.highestBid
            );
            emit AuctionEnded(
                listingId,
                listing.highestBidder,
                listing.highestBid
            );
        } else {
            // No bids, return NFT to seller
            nftContract.safeTransferFrom(
                address(this),
                listing.seller,
                listing.tokenId
            );
            emit AuctionEnded(listingId, address(0), 0);
        }
    }

    /**
     * @dev Cancel listing (only seller)
     */
    function cancelListing(uint256 listingId) public nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.isActive, "Listing not active");

        if (listing.isAuction && listing.highestBidder != address(0)) {
            require(
                block.timestamp < listing.auctionEndTime,
                "Cannot cancel auction with bids"
            );
            // Refund highest bidder
            pendingReturns[listing.highestBidder] += listing.highestBid;
        }

        listing.isActive = false;

        // Return NFT to seller
        nftContract.safeTransferFrom(
            address(this),
            listing.seller,
            listing.tokenId
        );

        emit ListingCancelled(listingId);
    }

    /**
     * @dev Withdraw pending returns
     */
    function withdraw() public nonReentrant {
        uint256 amount = pendingReturns[msg.sender];
        require(amount > 0, "No funds to withdraw");

        pendingReturns[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Get listing details
     */
    function getListing(
        uint256 listingId
    ) public view returns (Listing memory) {
        return listings[listingId];
    }

    /**
     * @dev Get all bids for a listing
     */
    function getListingBids(
        uint256 listingId
    ) public view returns (Bid[] memory) {
        return listingBids[listingId];
    }

    /**
     * @dev Calculate payment distribution
     */
    function _calculatePayments(
        uint256 tokenId,
        uint256 salePrice
    )
        private
        view
        returns (
            uint256 sellerAmount,
            uint256 platformFee,
            uint256 royaltyAmount,
            address royaltyRecipient
        )
    {
        platformFee = (salePrice * platformFeePercent) / 10000;

        // Check for royalties
        if (nftContract.supportsInterface(type(IERC2981).interfaceId)) {
            (royaltyRecipient, royaltyAmount) = nftContract.royaltyInfo(
                tokenId,
                salePrice
            );
        }

        sellerAmount = salePrice - platformFee - royaltyAmount;
    }

    /**
     * @dev Distribute payments to seller, platform, and royalty recipient
     */
    function _distributePayments(
        address seller,
        uint256 sellerAmount,
        uint256 platformFee,
        uint256 royaltyAmount,
        address royaltyRecipient
    ) private {
        // Pay seller
        if (sellerAmount > 0) {
            (bool success, ) = seller.call{value: sellerAmount}("");
            require(success, "Seller payment failed");
        }

        // Pay platform fee
        if (platformFee > 0) {
            (bool success, ) = communityWallet.call{value: platformFee}("");
            require(success, "Platform fee payment failed");
        }

        // Pay royalty
        if (royaltyAmount > 0 && royaltyRecipient != address(0)) {
            (bool success, ) = royaltyRecipient.call{value: royaltyAmount}("");
            require(success, "Royalty payment failed");
        }
    }

    /**
     * @dev Update platform fee (only owner)
     */
    function updatePlatformFee(uint256 _newFeePercent) public onlyOwner {
        require(_newFeePercent <= 1000, "Fee cannot exceed 10%");
        platformFeePercent = _newFeePercent;
    }

    /**
     * @dev Update community wallet (only owner)
     */
    function updateCommunityWallet(address _newWallet) public onlyOwner {
        require(_newWallet != address(0), "Invalid wallet address");
        communityWallet = _newWallet;
    }
}
