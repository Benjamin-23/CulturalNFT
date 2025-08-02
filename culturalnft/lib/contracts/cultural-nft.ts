import { ethers } from "ethers";
import CulturalNFTABI from "./abis/CulturalNFT.json";

export class CulturalNFTContract {
  private contract: ethers.Contract;
  private signer: ethers.Signer;

  constructor(contractAddress: string, signer: ethers.Signer) {
    this.contract = new ethers.Contract(
      contractAddress,
      CulturalNFTABI,
      signer,
    );
    this.signer = signer;
  }

  /**
   * Mint a new cultural NFT
   */
  async mintCulturalNFT(
    to: string,
    tokenURI: string,
    culture: string,
    artist: string,
    story: string,
    royaltyPercent: number,
  ) {
    try {
      const mintingFee = ethers.parseUnits("3", "ether"); // 3 HBAR

      const tx = await this.contract.mintCulturalNFT(
        to,
        tokenURI,
        culture,
        artist,
        story,
        royaltyPercent * 100, // Convert to basis points
        { value: mintingFee },
      );

      const receipt = await tx.wait();

      // Extract token ID from events
      const mintEvent = receipt.events?.find(
        (e: any) => e.event === "NFTMinted",
      );
      const tokenId = mintEvent?.args?.tokenId?.toString();

      return {
        success: true,
        tokenId,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      console.error("Minting failed:", error);
      throw error;
    }
  }

  /**
   * Like an artwork
   */
  async likeArtwork(tokenId: string) {
    try {
      const likeAmount = ethers.parseEther("1"); // 1 HBAR

      const tx = await this.contract.likeArtwork(tokenId, {
        value: likeAmount,
      });

      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      console.error("Like failed:", error);
      throw error;
    }
  }

  /**
   * Get cultural metadata for a token
   */
  async getCulturalData(tokenId: string) {
    try {
      const data = await this.contract.getCulturalData(tokenId);

      return {
        culture: data.culture,
        artist: data.artist,
        story: data.story,
        mintTimestamp: data.mintTimestamp.toNumber(),
        isActive: data.isActive,
      };
    } catch (error) {
      console.error("Failed to get cultural data:", error);
      throw error;
    }
  }

  /**
   * Get like statistics for a token
   */
  async getLikeStats(tokenId: string) {
    try {
      const [likes, rewards] = await this.contract.getLikeStats(tokenId);

      return {
        likes: likes.toNumber(),
        rewards: ethers.formatEther(rewards),
      };
    } catch (error) {
      console.error("Failed to get like stats:", error);
      throw error;
    }
  }

  /**
   * Check if user has liked a token
   */
  async hasUserLiked(userAddress: string, tokenId: string) {
    try {
      return await this.contract.hasUserLiked(userAddress, tokenId);
    } catch (error) {
      console.error("Failed to check like status:", error);
      throw error;
    }
  }

  /**
   * Get token URI
   */
  async tokenURI(tokenId: string) {
    try {
      return await this.contract.tokenURI(tokenId);
    } catch (error) {
      console.error("Failed to get token URI:", error);
      throw error;
    }
  }

  /**
   * Get token owner
   */
  async ownerOf(tokenId: string) {
    try {
      return await this.contract.ownerOf(tokenId);
    } catch (error) {
      console.error("Failed to get token owner:", error);
      throw error;
    }
  }

  /**
   * Get total supply
   */
  async totalSupply() {
    try {
      const supply = await this.contract.totalSupply();
      return supply.toNumber();
    } catch (error) {
      console.error("Failed to get total supply:", error);
      throw error;
    }
  }

  /**
   * Approve marketplace to transfer tokens
   */
  async setApprovalForAll(marketplaceAddress: string, approved: boolean) {
    try {
      const tx = await this.contract.setApprovalForAll(
        marketplaceAddress,
        approved,
      );
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.transactionHash,
      };
    } catch (error) {
      console.error("Approval failed:", error);
      throw error;
    }
  }

  /**
   * Check if marketplace is approved
   */
  async isApprovedForAll(owner: string, operator: string) {
    try {
      return await this.contract.isApprovedForAll(owner, operator);
    } catch (error) {
      console.error("Failed to check approval:", error);
      throw error;
    }
  }
}
