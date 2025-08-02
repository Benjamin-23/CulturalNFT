import { ethers } from "ethers";
import { CulturalNFTContract } from "./contracts/cultural-nft";
import { MarketplaceContract } from "./contracts/marketplace";

// Enhanced Hedera SDK integration utilities
export class HederaClient {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private nftContract: CulturalNFTContract | null = null;
  private marketplaceContract: MarketplaceContract | null = null;

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
    }
  }

  async connectWallet() {
    try {
      if (!this.provider) {
        throw new Error("No wallet provider found");
      }

      // Request account access
      await this.provider.send("eth_requestAccounts", []);
      this.signer = await this.provider.getSigner();

      // Initialize contracts
      const nftAddress = process.env.NEXT_PUBLIC_CULTURAL_NFT_ADDRESS;
      const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;

      if (!nftAddress || !marketplaceAddress) {
        throw new Error("Contract addresses not configured");
      }

      this.nftContract = new CulturalNFTContract(nftAddress, this.signer);
      this.marketplaceContract = new MarketplaceContract(
        marketplaceAddress,
        this.signer,
      );

      const address = await this.signer.getAddress();
      const balance = await this.provider.getBalance(address);

      return {
        success: true,
        address,
        balance: ethers.formatEther(balance),
      };
    } catch (error) {
      console.error("Wallet connection failed:", error);
      throw error;
    }
  }

  async mintNFT(metadata: {
    title: string;
    description: string;
    culture: string;
    story: string;
    imageUrl: string;
    artist: string;
    royalty: number;
  }) {
    try {
      if (!this.nftContract || !this.signer) {
        throw new Error("Contracts not initialized");
      }

      const userAddress = await this.signer.getAddress();

      // Create metadata JSON
      const tokenMetadata = {
        name: metadata.title,
        description: metadata.description,
        image: metadata.imageUrl,
        attributes: [
          { trait_type: "Culture", value: metadata.culture },
          { trait_type: "Artist", value: metadata.artist },
          { trait_type: "Story", value: metadata.story },
        ],
      };

      // In a real implementation, you would upload this to IPFS
      // For now, we'll use a placeholder URI
      const tokenURI = `data:application/json;base64,${Buffer.from(JSON.stringify(tokenMetadata)).toString("base64")}`;

      const result = await this.nftContract.mintCulturalNFT(
        userAddress,
        tokenURI,
        metadata.culture,
        metadata.artist,
        metadata.story,
        metadata.royalty,
      );

      return result;
    } catch (error) {
      console.error("NFT minting failed:", error);
      throw error;
    }
  }

  async createAuction(
    tokenId: string,
    startingPrice: number,
    duration: number,
  ) {
    try {
      if (!this.marketplaceContract || !this.nftContract) {
        throw new Error("Contracts not initialized");
      }

      // First, approve marketplace to transfer the NFT
      const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!;
      await this.nftContract.setApprovalForAll(marketplaceAddress, true);

      // Create auction
      const result = await this.marketplaceContract.createAuction(
        tokenId,
        startingPrice.toString(),
        duration,
        "50", // 50 HBAR minimum bid increment
      );

      return result;
    } catch (error) {
      console.error("Auction creation failed:", error);
      throw error;
    }
  }

  async placeBid(auctionId: string, bidAmount: number) {
    try {
      if (!this.marketplaceContract) {
        throw new Error("Marketplace contract not initialized");
      }

      const result = await this.marketplaceContract.placeBid(
        auctionId,
        bidAmount.toString(),
      );
      return result;
    } catch (error) {
      console.error("Bid placement failed:", error);
      throw error;
    }
  }

  async sendToCommuityWallet(amount: number, purpose: string) {
    try {
      if (!this.signer) {
        throw new Error("Signer not initialized");
      }

      const communityWallet = process.env.NEXT_PUBLIC_COMMUNITY_WALLET;
      if (!communityWallet) {
        throw new Error("Community wallet not configured");
      }

      const tx = await this.signer.sendTransaction({
        to: communityWallet,
        value: ethers.parseEther(amount.toString()),
      });

      const receipt = await tx.wait();

      return {
        success: true,
        transactionId: receipt?.hash || "",
        purpose,
      };
    } catch (error) {
      console.error("Community wallet transaction failed:", error);
      throw error;
    }
  }

  async purchaseNFT(listingId: string, amount: number) {
    try {
      if (!this.marketplaceContract) {
        throw new Error("Marketplace contract not initialized");
      }

      const result = await this.marketplaceContract.buyNFT(
        listingId,
        amount.toString(),
      );
      return result;
    } catch (error) {
      console.error("NFT purchase failed:", error);
      throw error;
    }
  }

  async likeArtwork(tokenId: string) {
    try {
      if (!this.nftContract) {
        throw new Error("NFT contract not initialized");
      }

      const result = await this.nftContract.likeArtwork(tokenId);
      return result;
    } catch (error) {
      console.error("Like artwork failed:", error);
      throw error;
    }
  }

  async getCulturalData(tokenId: string) {
    try {
      if (!this.nftContract) {
        throw new Error("NFT contract not initialized");
      }

      return await this.nftContract.getCulturalData(tokenId);
    } catch (error) {
      console.error("Failed to get cultural data:", error);
      throw error;
    }
  }

  async getLikeStats(tokenId: string) {
    try {
      if (!this.nftContract) {
        throw new Error("NFT contract not initialized");
      }

      return await this.nftContract.getLikeStats(tokenId);
    } catch (error) {
      console.error("Failed to get like stats:", error);
      throw error;
    }
  }

  async hasUserLiked(userAddress: string, tokenId: string) {
    try {
      if (!this.nftContract) {
        throw new Error("NFT contract not initialized");
      }

      return await this.nftContract.hasUserLiked(userAddress, tokenId);
    } catch (error) {
      console.error("Failed to check like status:", error);
      throw error;
    }
  }

  async getTokenURI(tokenId: string) {
    try {
      if (!this.nftContract) {
        throw new Error("NFT contract not initialized");
      }

      return await this.nftContract.tokenURI(tokenId);
    } catch (error) {
      console.error("Failed to get token URI:", error);
      throw error;
    }
  }

  async getTokenOwner(tokenId: string) {
    try {
      if (!this.nftContract) {
        throw new Error("NFT contract not initialized");
      }

      return await this.nftContract.ownerOf(tokenId);
    } catch (error) {
      console.error("Failed to get token owner:", error);
      throw error;
    }
  }

  async getTotalSupply() {
    try {
      if (!this.nftContract) {
        throw new Error("NFT contract not initialized");
      }

      return await this.nftContract.totalSupply();
    } catch (error) {
      console.error("Failed to get total supply:", error);
      throw error;
    }
  }

  async getListing(listingId: string) {
    try {
      if (!this.marketplaceContract) {
        throw new Error("Marketplace contract not initialized");
      }

      return await this.marketplaceContract.getListing(listingId);
    } catch (error) {
      console.error("Failed to get listing:", error);
      throw error;
    }
  }

  async getListingBids(listingId: string) {
    try {
      if (!this.marketplaceContract) {
        throw new Error("Marketplace contract not initialized");
      }

      return await this.marketplaceContract.getListingBids(listingId);
    } catch (error) {
      console.error("Failed to get listing bids:", error);
      throw error;
    }
  }

  async getPendingReturns(userAddress: string) {
    try {
      if (!this.marketplaceContract) {
        throw new Error("Marketplace contract not initialized");
      }

      return await this.marketplaceContract.getPendingReturns(userAddress);
    } catch (error) {
      console.error("Failed to get pending returns:", error);
      throw error;
    }
  }

  async withdrawPendingReturns() {
    try {
      if (!this.marketplaceContract) {
        throw new Error("Marketplace contract not initialized");
      }

      return await this.marketplaceContract.withdraw();
    } catch (error) {
      console.error("Withdraw failed:", error);
      throw error;
    }
  }

  // Utility methods
  isConnected(): boolean {
    return (
      this.signer !== null &&
      this.nftContract !== null &&
      this.marketplaceContract !== null
    );
  }

  async getConnectedAddress(): Promise<string | null> {
    try {
      if (!this.signer) return null;
      return await this.signer.getAddress();
    } catch (error) {
      console.error("Failed to get connected address:", error);
      return null;
    }
  }

  async getBalance(address?: string): Promise<string | null> {
    try {
      if (!this.provider) return null;

      const targetAddress = address || (await this.signer?.getAddress());
      if (!targetAddress) return null;

      const balance = await this.provider.getBalance(targetAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Failed to get balance:", error);
      return null;
    }
  }

  async switchNetwork(chainId: number) {
    try {
      if (!this.provider) {
        throw new Error("No provider available");
      }

      await this.provider.send("wallet_switchEthereumChain", [
        { chainId: `0x${chainId.toString(16)}` },
      ]);

      return { success: true };
    } catch (error: any) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        return await this.addNetwork(chainId);
      }
      throw error;
    }
  }

  private async addNetwork(chainId: number) {
    try {
      if (!this.provider) {
        throw new Error("No provider available");
      }

      const networkConfig = this.getNetworkConfig(chainId);

      await this.provider.send("wallet_addEthereumChain", [networkConfig]);

      return { success: true };
    } catch (error) {
      console.error("Failed to add network:", error);
      throw error;
    }
  }

  private getNetworkConfig(chainId: number) {
    const configs: { [key: number]: any } = {
      296: {
        chainId: "0x128",
        chainName: "Hedera Testnet",
        nativeCurrency: {
          name: "HBAR",
          symbol: "HBAR",
          decimals: 18,
        },
        rpcUrls: ["https://testnet.hashio.io/api"],
        blockExplorerUrls: ["https://hashscan.io/testnet"],
      },
      295: {
        chainId: "0x127",
        chainName: "Hedera Mainnet",
        nativeCurrency: {
          name: "HBAR",
          symbol: "HBAR",
          decimals: 18,
        },
        rpcUrls: ["https://mainnet.hashio.io/api"],
        blockExplorerUrls: ["https://hashscan.io/mainnet"],
      },
    };

    return configs[chainId] || configs[296]; // Default to testnet
  }
}

export const hederaClient = new HederaClient();
