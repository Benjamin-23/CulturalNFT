"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Palette,
  Coins,
  AlertCircle,
  CheckCircle,
  Wallet,
} from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { hederaClient } from "@/lib/hedera-client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function MintPage() {
  const { isConnected, connectWallet } = useWallet();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    culture: "",
    story: "",
    price: "",
    royalty: "10",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    tokenId?: string;
    transactionHash?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(null);

    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    if (!imageFile) {
      setError("Please select an image file");
      return;
    }

    setIsLoading(true);

    try {
      // In production, upload image to IPFS
      // For now, create a data URL
      const imageUrl = URL.createObjectURL(imageFile);

      const metadata = {
        title: formData.title,
        description: formData.description,
        culture: formData.culture,
        story: formData.story,
        imageUrl,
        artist: "Current User", // In production, get from user profile
        royalty: Number.parseInt(formData.royalty),
        price: Number.parseInt(formData.price),
      };
      console.log(metadata, "meta data");
      const result = await hederaClient.mintNFT(metadata);
      console.log(result);
      console.log(result.tokenId);
      console.log(result.transactionHash);
      console.log(result.tokenId);
      console.log(result.transactionHash);

      setSuccess({
        tokenId: result.tokenId,
        transactionHash: result.transactionHash,
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        culture: "",
        story: "",
        price: "",
        royalty: "10",
      });
      setImageFile(null);
    } catch (error: any) {
      console.error("Minting failed:", error);
      setError(error.message || "Minting failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <Wallet className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-6">
              You need to connect your Hedera wallet to mint NFTs
            </p>
            <Button
              onClick={connectWallet}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mint Your Cultural Art
          </h1>
          <p className="text-xl text-gray-600">
            Share your cultural heritage with the world
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="space-y-2">
                <div>🎉 NFT minted successfully!</div>
                {success.tokenId && <div>Token ID: {success.tokenId}</div>}
                {success.transactionHash && (
                  <div>
                    Transaction:{" "}
                    <a
                      href={`https://hashscan.io/testnet/transaction/${success.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-green-600"
                    >
                      View on HashScan
                    </a>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-6 w-6 text-purple-600" />
              <span>Create NFT</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Image Upload */}
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="image">Artwork Image *</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                      {imageFile ? (
                        <div>
                          <img
                            src={
                              URL.createObjectURL(imageFile) ||
                              "/placeholder.svg"
                            }
                            alt="Preview"
                            className="max-w-full h-48 object-cover mx-auto rounded-lg mb-4"
                          />
                          <p className="text-sm text-gray-600">
                            {imageFile.name}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">
                            Drop your artwork here or click to browse
                          </p>
                          <p className="text-sm text-gray-400 mt-2">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setImageFile(e.target.files?.[0] || null)
                        }
                        className="hidden"
                        id="image-upload"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4 bg-transparent"
                        onClick={() =>
                          document.getElementById("image-upload")?.click()
                        }
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right Column - Form Fields */}
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="title">Artwork Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter artwork title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="culture">Cultural Origin *</Label>
                    <Select
                      value={formData.culture}
                      onValueChange={(value) =>
                        setFormData({ ...formData, culture: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cultural origin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="african">African</SelectItem>
                        <SelectItem value="asian">Asian</SelectItem>
                        <SelectItem value="european">European</SelectItem>
                        <SelectItem value="middle-eastern">
                          Middle Eastern
                        </SelectItem>
                        <SelectItem value="native-american">
                          Native American
                        </SelectItem>
                        <SelectItem value="latin-american">
                          Latin American
                        </SelectItem>
                        <SelectItem value="oceanic">Oceanic</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe your artwork"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="story">Cultural Story & Meaning</Label>
                    <Textarea
                      id="story"
                      value={formData.story}
                      onChange={(e) =>
                        setFormData({ ...formData, story: e.target.value })
                      }
                      placeholder="Share the cultural significance and story behind your art"
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className=" flex flex-col gap-2 ">
                      <label htmlFor="price">Price (HBAR)</label>
                      <input
                        type="number"
                        id="price"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        placeholder="Enter price in HBAR"
                        className=" border border-gray-300 rounded-md px-2 py-1"
                      />
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <Label htmlFor="royalty">Royalty (%) *</Label>
                      <Select
                        value={formData.royalty}
                        onValueChange={(value) =>
                          setFormData({ ...formData, royalty: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5%</SelectItem>
                          <SelectItem value="10">10%</SelectItem>
                          <SelectItem value="15">15%</SelectItem>
                          <SelectItem value="20">20%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="bg-purple-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-purple-900 mb-2">
                    Minting Cost Breakdown
                  </h3>
                  <div className="space-y-1 text-sm text-purple-700">
                    <div className="flex justify-between">
                      <span>NFT Creation Fee:</span>
                      <span>2 HBAR</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Fee:</span>
                      <span>1 HBAR</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-1">
                      <span>Total:</span>
                      <span>3 HBAR</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Minting NFT...
                    </>
                  ) : (
                    <>
                      <Coins className="mr-2 h-5 w-5" />
                      Mint NFT for 3 HBAR
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
