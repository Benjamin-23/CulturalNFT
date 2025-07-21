"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Palette, Coins } from "lucide-react"

export default function MintPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    culture: "",
    story: "",
    price: "",
    royalty: "10",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Here you would implement the Hedera NFT minting logic
      console.log("Minting NFT with data:", formData)
      console.log("Image file:", imageFile)

      // Simulate minting process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      alert("NFT minted successfully!")
    } catch (error) {
      console.error("Minting failed:", error)
      alert("Minting failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mint Your Cultural Art</h1>
          <p className="text-xl text-gray-600">Share your cultural heritage with the world</p>
        </div>

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
                            src={URL.createObjectURL(imageFile) || "/placeholder.svg"}
                            alt="Preview"
                            className="max-w-full h-48 object-cover mx-auto rounded-lg mb-4"
                          />
                          <p className="text-sm text-gray-600">{imageFile.name}</p>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Drop your artwork here or click to browse</p>
                          <p className="text-sm text-gray-400 mt-2">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4 bg-transparent"
                        onClick={() => document.getElementById("image-upload")?.click()}
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
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter artwork title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="culture">Cultural Origin *</Label>
                    <Select
                      value={formData.culture}
                      onValueChange={(value) => setFormData({ ...formData, culture: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cultural origin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="african">African</SelectItem>
                        <SelectItem value="asian">Asian</SelectItem>
                        <SelectItem value="european">European</SelectItem>
                        <SelectItem value="middle-eastern">Middle Eastern</SelectItem>
                        <SelectItem value="native-american">Native American</SelectItem>
                        <SelectItem value="latin-american">Latin American</SelectItem>
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
                      onChange={(e:any) => setFormData({ ...formData, description: e.target.value })}
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
                      onChange={(e:any) => setFormData({ ...formData, story: e.target.value })}
                      placeholder="Share the cultural significance and story behind your art"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Starting Price (HBAR) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="100"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="royalty">Royalty (%) *</Label>
                      <Select
                        value={formData.royalty}
                        onValueChange={(value) => setFormData({ ...formData, royalty: value })}
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
                  <h3 className="font-semibold text-purple-900 mb-2">Minting Cost Breakdown</h3>
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
  )
}
