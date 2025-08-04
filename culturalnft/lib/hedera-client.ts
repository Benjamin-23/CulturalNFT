import { ethers } from "ethers";

// Import your contract ABIs
import CulturalNFTABI from "./contracts/abis/CulturalNFT.json";
import CulturalMarketplaceABI from "./contracts/abis/CulturalMarketplace.json";
// import CommunityRewardsABI from "./contracts/abis/CommunityRewards.json"

// Enhanced Hedera SDK integration utilities for ethers v6
export class HederaClient {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private nftContract: ethers.Contract | null = null;
  private marketplaceContract: ethers.Contract | null = null;
  private rewardsContract: ethers.Contract | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeProvider();
    }
  }

  private async initializeProvider() {
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        this.provider = new ethers.BrowserProvider((window as any).ethereum);

        // Listen for account changes
        (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
          if (accounts.length === 0) {
            this.disconnect();
          } else {
            this.connectWallet();
          }
        });

        // Listen for chain changes
        (window as any).ethereum.on("chainChanged", () => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.error("Failed to initialize provider:", error);
    }
  }

  async connectWallet() {
    try {
      if (!this.provider) {
        throw new Error(
          "No wallet provider found. Please install HashPack or MetaMask.",
        );
      }

      // Request account access
      await this.provider.send("eth_requestAccounts", []);
      this.signer = await this.provider.getSigner();

      // Check if we're on the correct network
      const network = await this.provider.getNetwork();
      const expectedChainId = process.env.NEXT_PUBLIC_CHAIN_ID
        ? Number.parseInt(process.env.NEXT_PUBLIC_CHAIN_ID)
        : 296;

      if (Number(network.chainId) !== expectedChainId) {
        await this.switchNetwork(expectedChainId);
      }

      // Initialize contracts
      await this.initializeContracts();

      const address = await this.signer.getAddress();
      const balance = await this.provider.getBalance(address);

      this.isInitialized = true;

      return {
        success: true,
        address,
        balance: ethers.formatEther(balance),
        chainId: Number(network.chainId),
      };
    } catch (error) {
      console.error("Wallet connection failed:", error);
      throw error;
    }
  }

  private async initializeContracts() {
    if (!this.signer) {
      throw new Error("Signer not available");
    }

    const nftAddress = process.env.NEXT_PUBLIC_CULTURAL_NFT_ADDRESS;
    const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
    const rewardsAddress = process.env.NEXT_PUBLIC_REWARDS_ADDRESS;

    if (!nftAddress || !marketplaceAddress || !rewardsAddress) {
      throw new Error(
        "Contract addresses not configured. Please deploy contracts first.",
      );
    }

    this.nftContract = new ethers.Contract(
      nftAddress,
      CulturalNFTABI,
      this.signer,
    );
    this.marketplaceContract = new ethers.Contract(
      marketplaceAddress,
      CulturalMarketplaceABI,
      this.signer,
    );
    // this.rewardsContract = new ethers.Contract(rewardsAddress, CommunityRewardsABI, this.signer)
  }

  disconnect() {
    this.signer = null;
    this.nftContract = null;
    this.marketplaceContract = null;
    this.rewardsContract = null;
    this.isInitialized = false;
  }

  // NFT Contract Methods
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
        throw new Error(
          "Contracts not initialized. Please connect wallet first.",
        );
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
          { trait_type: "Mint Date", value: new Date().toISOString() },
        ],
      };

      // In production, upload to IPFS. For now, use base64 encoding
      const tokenURI = `data:application/json;base64,${Buffer.from(JSON.stringify(tokenMetadata)).toString("base64")}`;

      // Convert royalty percentage to basis points (e.g., 5% = 500)
      const royaltyBasisPoints = metadata.royalty * 100;

      const mintingFee = ethers.parseEther("3"); // 3 HBAR

      const tx = await this.nftContract.mintCulturalNFT(
        userAddress,
        tokenURI,
        metadata.culture,
        metadata.artist,
        metadata.story,
        royaltyBasisPoints,
        { value: mintingFee },
      );
      console.log("Transaction hash:", tx);
      console.log("Transaction status:", tx.status);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error("NFT minting failed:", error);
      throw error;
    }
  }

  async likeArtwork(tokenId: string) {
    try {
      if (!this.nftContract) {
        throw new Error("NFT contract not initialized");
      }

      const likeAmount = ethers.parseEther("1"); // 1 HBAR
      const tx = await this.nftContract.likeArtwork(tokenId, {
        value: likeAmount,
      });
      const receipt = await tx.wait();
      return receipt;
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
      const [likes, rewards] = await this.nftContract.getLikeStats(tokenId);
      return {
        likes: Number(likes),
        rewards: ethers.formatEther(rewards),
      };
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
      const supply = await this.nftContract.totalSupply();
      return Number(supply);
    } catch (error) {
      console.error("Failed to get total supply:", error);
      throw error;
    }
  }

  // Marketplace Contract Methods
  async listNFT(tokenId: string, price: number) {
    try {
      if (!this.marketplaceContract || !this.nftContract) {
        throw new Error("Contracts not initialized");
      }

      // First, approve marketplace to transfer the NFT
      const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!;
      const userAddress = await this.signer!.getAddress();
      const isApproved = await this.nftContract.isApprovedForAll(
        userAddress,
        marketplaceAddress,
      );

      if (!isApproved) {
        const approveTx = await this.nftContract.setApprovalForAll(
          marketplaceAddress,
          true,
        );
        await approveTx.wait();
      }

      // Create listing
      const priceInWei = ethers.parseEther(price.toString());
      const tx = await this.marketplaceContract.listNFT(tokenId, priceInWei);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error("List NFT failed:", error);
      throw error;
    }
  }

  async buyNFT(tokenId: string, price: number) {
    try {
      if (!this.marketplaceContract) {
        throw new Error("Marketplace contract not initialized");
      }

      const priceInWei = ethers.parseEther(price.toString());
      const tx = await this.marketplaceContract.buyNFT(tokenId, {
        value: priceInWei,
      });
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error("NFT purchase failed:", error);
      throw error;
    }
  }

  async cancelListing(tokenId: string) {
    try {
      if (!this.marketplaceContract) {
        throw new Error("Marketplace contract not initialized");
      }

      const tx = await this.marketplaceContract.cancelListing(tokenId);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error("Cancel listing failed:", error);
      throw error;
    }
  }

  async updatePrice(tokenId: string, newPrice: number) {
    try {
      if (!this.marketplaceContract) {
        throw new Error("Marketplace contract not initialized");
      }

      const priceInWei = ethers.parseEther(newPrice.toString());
      const tx = await this.marketplaceContract.updatePrice(
        tokenId,
        priceInWei,
      );
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error("Update price failed:", error);
      throw error;
    }
  }

  async getListing(tokenId: string) {
    try {
      if (!this.marketplaceContract) {
        throw new Error("Marketplace contract not initialized");
      }
      const listing = await this.marketplaceContract.getListing(tokenId);
      return {
        tokenId: Number(listing.tokenId),
        seller: listing.seller,
        price: ethers.formatEther(listing.price),
        active: listing.active,
        listedAt: Number(listing.listedAt),
      };
    } catch (error) {
      console.error("Failed to get listing:", error);
      throw error;
    }
  }

  async getActiveListings() {
    try {
      if (!this.marketplaceContract) {
        throw new Error("Marketplace contract not initialized");
      }
      const listings = await this.marketplaceContract.getActiveListings();
      return listings.map((listing: any) => ({
        tokenId: Number(listing.tokenId),
        seller: listing.seller,
        price: ethers.formatEther(listing.price),
        active: listing.active,
        listedAt: Number(listing.listedAt),
      }));
    } catch (error) {
      console.error("Failed to get active listings:", error);
      throw error;
    }
  }

  // Community Rewards Contract Methods
  async claimRewards() {
    try {
      if (!this.rewardsContract) {
        throw new Error("Rewards contract not initialized");
      }

      const tx = await this.rewardsContract.claimRewards();
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error("Claim rewards failed:", error);
      throw error;
    }
  }

  async getAvailableRewards(userAddress?: string) {
    try {
      if (!this.rewardsContract) {
        throw new Error("Rewards contract not initialized");
      }

      const address = userAddress || (await this.signer?.getAddress());
      if (!address) throw new Error("No user address available");

      const rewards = await this.rewardsContract.getAvailableRewards(address);
      return ethers.formatEther(rewards);
    } catch (error) {
      console.error("Failed to get available rewards:", error);
      throw error;
    }
  }

  async getCommunityStats() {
    try {
      if (!this.rewardsContract) {
        throw new Error("Rewards contract not initialized");
      }

      const stats = await this.rewardsContract.getCommunityStats();
      return {
        totalCreatorPool: ethers.formatEther(stats.totalCreatorPool),
        totalHolderPool: ethers.formatEther(stats.totalHolderPool),
        totalDistributed: ethers.formatEther(stats.totalDistributed),
        totalBalance: ethers.formatEther(stats.totalBalance),
      };
    } catch (error) {
      console.error("Failed to get community stats:", error);
      throw error;
    }
  }

  async depositRewards(amount: number, rewardType: string = "general") {
    try {
      if (!this.rewardsContract) {
        throw new Error("Rewards contract not initialized");
      }

      const amountInWei = ethers.parseEther(amount.toString());
      const tx = await this.rewardsContract.depositRewards(rewardType, {
        value: amountInWei,
      });
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error("Deposit rewards failed:", error);
      throw error;
    }
  }

  // Utility Methods
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
        transactionHash: receipt?.hash,
        purpose,
      };
    } catch (error) {
      console.error("Community wallet transaction failed:", error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.isInitialized && this.signer !== null;
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

  // Advanced Contract Methods
  async getAllTokens(limit = 50, offset = 0) {
    try {
      if (!this.nftContract) {
        throw new Error("NFT contract not initialized");
      }

      const totalSupply = await this.nftContract.totalSupply();
      const tokens = [];

      const start = Math.max(0, offset);
      const end = Math.min(Number(totalSupply), start + limit);

      for (let i = start; i < end; i++) {
        try {
          const tokenId = i.toString(); // Token IDs start from 0
          const tokenURI = await this.nftContract.tokenURI(tokenId);
          const owner = await this.nftContract.ownerOf(tokenId);
          const culturalData = await this.nftContract.getCulturalData(tokenId);
          const likeStats = await this.getLikeStats(tokenId);

          tokens.push({
            tokenId,
            tokenURI,
            owner,
            culturalData,
            likeStats,
          });
        } catch (error) {
          console.error(`Failed to get token at index ${i}:`, error);
        }
      }

      return tokens;
    } catch (error) {
      console.error("Failed to get all tokens:", error);
      throw error;
    }
  }

  async getUserTokens(userAddress: string) {
    try {
      if (!this.nftContract) {
        throw new Error("NFT contract not initialized");
      }

      const balance = await this.nftContract.balanceOf(userAddress);
      const tokens = [];

      for (let i = 0; i < Number(balance); i++) {
        try {
          // Note: This requires ERC721Enumerable extension
          // If not available, you'll need to iterate through all tokens
          const tokenId = await this.nftContract.tokenOfOwnerByIndex(
            userAddress,
            i,
          );
          const tokenURI = await this.nftContract.tokenURI(tokenId);
          const culturalData = await this.nftContract.getCulturalData(tokenId);
          const likeStats = await this.getLikeStats(tokenId.toString());

          tokens.push({
            tokenId: tokenId.toString(),
            tokenURI,
            culturalData,
            likeStats,
          });
        } catch (error) {
          console.error(`Failed to get user token at index ${i}:`, error);
        }
      }

      return tokens;
    } catch (error) {
      console.error("Failed to get user tokens:", error);
      throw error;
    }
  }

  // Event Listeners
  onTokenMinted(
    callback: (tokenId: string, owner: string, culture: string) => void,
  ) {
    if (!this.nftContract) return;

    this.nftContract.on(
      "NFTMinted",
      (tokenId, artist, culture, tokenURI, royaltyPercent) => {
        callback(tokenId.toString(), artist, culture);
      },
    );
  }

  onTokenLiked(
    callback: (
      tokenId: string,
      liker: string,
      amount: string,
      totalLikes: string,
    ) => void,
  ) {
    if (!this.nftContract) return;

    this.nftContract.on(
      "ArtworkLiked",
      (tokenId, liker, amount, totalLikes) => {
        callback(
          tokenId.toString(),
          liker,
          ethers.formatEther(amount),
          totalLikes.toString(),
        );
      },
    );
  }

  onNFTListed(
    callback: (
      tokenId: string,
      seller: string,
      price: string,
      listedAt: string,
    ) => void,
  ) {
    if (!this.marketplaceContract) return;

    this.marketplaceContract.on(
      "NFTListed",
      (tokenId, seller, price, listedAt) => {
        callback(
          tokenId.toString(),
          seller,
          ethers.formatEther(price),
          listedAt.toString(),
        );
      },
    );
  }

  onNFTSold(
    callback: (
      tokenId: string,
      seller: string,
      buyer: string,
      price: string,
      royaltyAmount: string,
      platformFee: string,
    ) => void,
  ) {
    if (!this.marketplaceContract) return;

    this.marketplaceContract.on(
      "NFTSold",
      (tokenId, seller, buyer, price, royaltyAmount, platformFee) => {
        callback(
          tokenId.toString(),
          seller,
          buyer,
          ethers.formatEther(price),
          ethers.formatEther(royaltyAmount),
          ethers.formatEther(platformFee),
        );
      },
    );
  }

  onRewardsClaimed(callback: (user: string, amount: string) => void) {
    if (!this.rewardsContract) return;

    this.rewardsContract.on("RewardsClaimed", (user, amount) => {
      callback(user, ethers.formatEther(amount));
    });
  }

  // Cleanup
  removeAllListeners() {
    if (this.nftContract) {
      this.nftContract.removeAllListeners();
    }
    if (this.marketplaceContract) {
      this.marketplaceContract.removeAllListeners();
    }
    if (this.rewardsContract) {
      this.rewardsContract.removeAllListeners();
    }
  }
}

export const hederaClient = new HederaClient();
