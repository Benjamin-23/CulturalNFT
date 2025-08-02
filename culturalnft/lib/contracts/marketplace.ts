import { ethers } from "ethers";
import MarketplaceABI from "./abis/CulturalMarketplace.json";

export class MarketplaceContract {
  private contract: ethers.Contract;
  private signer: ethers.Signer;

  constructor(contractAddress: string, signer: ethers.Signer) {
    this.contract = new ethers.Contract(
      contractAddress,
      MarketplaceABI,
      signer,
    );
    this.signer = signer;
  }

  /**
   * Create a fixed-price listing
   */
  async createListing(tokenId: string, price: string) {
    try {
      const priceWei = ethers.parseEther(price);

      const tx = await this.contract.createListing(tokenId, priceWei);
      const receipt = await tx.wait();

      // Extract listing ID from events
      const listingEvent = receipt.events?.find(
        (e: any) => e.event === "ListingCreated",
      );
      const listingId = listingEvent?.args?.listingId?.toString();

      return {
        success: true,
        listingId,
        transactionHash: receipt.transactionHash,
      };
    } catch (error) {
      console.error("Create listing failed:", error);
      throw error;
    }
  }

  /**
   * Create an auction listing
   */
  async createAuction(
    tokenId: string,
    startingPrice: string,
    duration: number,
    minBidIncrement: string,
  ) {
    try {
      const startingPriceWei = ethers.parseEther(startingPrice);
      const minBidIncrementWei = ethers.parseEther(minBidIncrement);

      const tx = await this.contract.createAuction(
        tokenId,
        startingPriceWei,
        duration,
        minBidIncrementWei,
      );
      const receipt = await tx.wait();

      // Extract listing ID from events
      const listingEvent = receipt.events?.find(
        (e: any) => e.event === "ListingCreated",
      );
      const listingId = listingEvent?.args?.listingId?.toString();

      return {
        success: true,
        listingId,
        transactionHash: receipt.transactionHash,
      };
    } catch (error) {
      console.error("Create auction failed:", error);
      throw error;
    }
  }

  /**
   * Buy NFT at fixed price
   */
  async buyNFT(listingId: string, price: string) {
    try {
      const priceWei = ethers.parseEther(price);

      const tx = await this.contract.buyNFT(listingId, {
        value: priceWei,
      });
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.transactionHash,
      };
    } catch (error) {
      console.error("Buy NFT failed:", error);
      throw error;
    }
  }

  /**
   * Place bid on auction
   */
  async placeBid(listingId: string, bidAmount: string) {
    try {
      const bidAmountWei = ethers.parseEther(bidAmount);

      const tx = await this.contract.placeBid(listingId, {
        value: bidAmountWei,
      });
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.transactionHash,
      };
    } catch (error) {
      console.error("Place bid failed:", error);
      throw error;
    }
  }

  /**
   * End auction
   */
  async endAuction(listingId: string) {
    try {
      const tx = await this.contract.endAuction(listingId);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.transactionHash,
      };
    } catch (error) {
      console.error("End auction failed:", error);
      throw error;
    }
  }

  /**
   * Cancel listing
   */
  async cancelListing(listingId: string) {
    try {
      const tx = await this.contract.cancelListing(listingId);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.transactionHash,
      };
    } catch (error) {
      console.error("Cancel listing failed:", error);
      throw error;
    }
  }

  /**
   * Withdraw pending returns
   */
  async withdraw() {
    try {
      const tx = await this.contract.withdraw();
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.transactionHash,
      };
    } catch (error) {
      console.error("Withdraw failed:", error);
      throw error;
    }
  }

  /**
   * Get listing details
   */
  async getListing(listingId: string) {
    try {
      const listing = await this.contract.getListing(listingId);

      return {
        tokenId: listing.tokenId.toString(),
        seller: listing.seller,
        price: ethers.formatEther(listing.price),
        isActive: listing.isActive,
        isAuction: listing.isAuction,
        auctionEndTime: listing.auctionEndTime.toNumber(),
        highestBidder: listing.highestBidder,
        highestBid: ethers.formatEther(listing.highestBid),
        minBidIncrement: ethers.formatEther(listing.minBidIncrement),
      };
    } catch (error) {
      console.error("Failed to get listing:", error);
      throw error;
    }
  }

  /**
   * Get all bids for a listing
   */
  async getListingBids(listingId: string) {
    try {
      const bids = await this.contract.getListingBids(listingId);

      return bids.map((bid: any) => ({
        bidder: bid.bidder,
        amount: ethers.formatEther(bid.amount),
        timestamp: bid.timestamp.toNumber(),
      }));
    } catch (error) {
      console.error("Failed to get listing bids:", error);
      throw error;
    }
  }

  /**
   * Get pending returns for user
   */
  async getPendingReturns(userAddress: string) {
    try {
      const amount = await this.contract.pendingReturns(userAddress);
      return ethers.formatEther(amount);
    } catch (error) {
      console.error("Failed to get pending returns:", error);
      throw error;
    }
  }
}
