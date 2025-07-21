"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Heart, Eye, Clock, Coins } from "lucide-react"
import { BidModal } from "@/components/bid-modal"
import { LikeConfirmationDialog } from "@/components/like-confirmation-dialog"

const artworks = [
  {
    id: 1,
    title: "Sacred Geometry of Mandala",
    artist: "Priya Sharma",
    culture: "Indian",
    price: "500 HBAR",
    highestBid: "750 HBAR",
    likes: 234,
    views: 1205,
    timeLeft: "2d 14h",
    image: "/placeholder.svg?height=400&width=400",
    isAuction: true,
  },
  {
    id: 2,
    title: "Dragon Dance Heritage",
    artist: "Li Wei",
    culture: "Chinese",
    price: "800 HBAR",
    highestBid: "1200 HBAR",
    likes: 189,
    views: 892,
    timeLeft: "1d 8h",
    image: "/placeholder.svg?height=400&width=400",
    isAuction: true,
  },
  {
    id: 3,
    title: "Ancestral Masks",
    artist: "Kwame Asante",
    culture: "African",
    price: "650 HBAR",
    highestBid: null,
    likes: 156,
    views: 743,
    timeLeft: null,
    image: "/placeholder.svg?height=400&width=400",
    isAuction: false,
  },
  {
    id: 4,
    title: "Henna Patterns of Joy",
    artist: "Fatima Al-Zahra",
    culture: "Middle Eastern",
    price: "400 HBAR",
    highestBid: "600 HBAR",
    likes: 456,
    views: 2340,
    timeLeft: "5d 12h",
    image: "/placeholder.svg?height=400&width=400",
    isAuction: true,
  },
  {
    id: 5,
    title: "Samurai Honor Code",
    artist: "Takeshi Yamamoto",
    culture: "Japanese",
    price: "900 HBAR",
    highestBid: null,
    likes: 389,
    views: 1876,
    timeLeft: null,
    image: "/placeholder.svg?height=400&width=400",
    isAuction: false,
  },
  {
    id: 6,
    title: "Aztec Sun Calendar",
    artist: "Maria Gonzalez",
    culture: "Mexican",
    price: "550 HBAR",
    highestBid: "720 HBAR",
    likes: 312,
    views: 1654,
    timeLeft: "3d 6h",
    image: "/placeholder.svg?height=400&width=400",
    isAuction: true,
  },
]

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [cultureFilter, setCultureFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [likedItems, setLikedItems] = useState<number[]>([])
  const [selectedArtwork, setSelectedArtwork] = useState<(typeof artworks)[0] | null>(null)
  const [isBidModalOpen, setIsBidModalOpen] = useState(false)
  const [isLikeDialogOpen, setIsLikeDialogOpen] = useState(false)
  const [artworkToLike, setArtworkToLike] = useState<(typeof artworks)[0] | null>(null)

  const handleLikeClick = (artwork: (typeof artworks)[0]) => {
    // Check if already liked
    if (likedItems.includes(artwork.id)) {
      // Show a toast or alert that they can't unlike
      alert("You've already shown love for this artwork! ❤️")
      return
    }

    // Open confirmation dialog
    setArtworkToLike(artwork)
    setIsLikeDialogOpen(true)
  }

  const handleLikeConfirm = async (artwork: (typeof artworks)[0]) => {
    // Simulate Hedera transaction
    console.log(`Sending 1 HBAR to community wallet for liking art ${artwork.id}`)

    // Add to liked items
    setLikedItems([...likedItems, artwork.id])

    // Add to like history
    const likeEntry = {
      id: Date.now(),
      artworkTitle: artwork.title,
      artist: artwork.artist,
      culture: artwork.culture,
      amount: "1.0 HBAR",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
      transactionId: `0.0.123456@${Date.now()}.${Math.random().toString().slice(2, 11)}`,
      image: artwork.image,
      artworkLikes: artwork.likes + 1,
      pointsEarned: 10,
    }

    console.log("Adding to like history:", likeEntry)

    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch =
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCulture = cultureFilter === "all" || artwork.culture.toLowerCase() === cultureFilter
    return matchesSearch && matchesCulture
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Art Gallery</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Discover and collect unique cultural NFTs</p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search artworks..."
                value={searchTerm}
                onChange={(e:any) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={cultureFilter} onValueChange={setCultureFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by culture" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cultures</SelectItem>
                <SelectItem value="african">African</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
                <SelectItem value="indian">Indian</SelectItem>
                <SelectItem value="japanese">Japanese</SelectItem>
                <SelectItem value="mexican">Mexican</SelectItem>
                <SelectItem value="middle eastern">Middle Eastern</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="most-liked">Most Liked</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArtworks.map((artwork) => (
            <Card
              key={artwork.id}
              className="group hover:shadow-2xl transition-all duration-300 overflow-hidden dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="relative">
                <Image
                  src={artwork.image || "/placeholder.svg"}
                  alt={artwork.title}
                  width={400}
                  height={400}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 dark:bg-gray-800/90">
                    {artwork.culture}
                  </Badge>
                </div>
                {artwork.isAuction && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-orange-500 text-white">Auction</Badge>
                  </div>
                )}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <div className="bg-black/50 text-white px-2 py-1 rounded-full text-sm flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {artwork.views}
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{artwork.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">by {artwork.artist}</p>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {artwork.isAuction ? "Current Bid" : "Price"}
                    </p>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {artwork.highestBid || artwork.price}
                    </p>
                  </div>
                  {artwork.timeLeft && (
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Time Left</p>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-orange-500 font-medium">{artwork.timeLeft}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => handleLikeClick(artwork)}
                    disabled={likedItems.includes(artwork.id)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all ${
                      likedItems.includes(artwork.id)
                        ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 cursor-not-allowed"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 cursor-pointer"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${likedItems.includes(artwork.id) ? "fill-current" : ""}`} />
                    <span className="text-sm">{artwork.likes + (likedItems.includes(artwork.id) ? 1 : 0)}</span>
                    {!likedItems.includes(artwork.id) && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">(-1 HBAR)</span>
                    )}
                  </button>
                </div>

                <div className="flex space-x-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                    onClick={() => {
                      setSelectedArtwork(artwork)
                      setIsBidModalOpen(true)
                    }}
                  >
                    <Coins className="mr-2 h-4 w-4" />
                    {artwork.isAuction ? "Place Bid" : "Buy Now"}
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArtworks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 dark:text-gray-400">No artworks found matching your criteria.</p>
          </div>
        )}

        {/* Modals */}
        <BidModal
          isOpen={isBidModalOpen}
          onClose={() => {
            setIsBidModalOpen(false)
            setSelectedArtwork(null)
          }}
          artwork={selectedArtwork}
        />

        <LikeConfirmationDialog
          isOpen={isLikeDialogOpen}
          onClose={() => {
            setIsLikeDialogOpen(false)
            setArtworkToLike(null)
          }}
          onConfirm={() => handleLikeConfirm(artworkToLike!)}
          artwork={artworkToLike}
        />
      </div>
    </div>
  )
}
