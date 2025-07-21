"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Coins, Star, Gift, Edit3, Settings, Award, TrendingUp, Calendar, Download } from "lucide-react"
import Image from "next/image"

const userProfile = {
  username: "ArtCollector2024",
  avatar: "/placeholder.svg?height=100&width=100",
  totalPoints: 15420,
  level: "Diamond",
  likesGiven: 2847,
  nftsOwned: 23,
  nftsSold: 8,
  totalSpent: "12,450 HBAR",
  totalEarned: "8,920 HBAR",
  joinDate: "January 2024",
  redeemTarget: 20000,
  badges: ["Top Collector", "Culture Enthusiast", "Community Leader", "Early Adopter"],
  weeklyPoints: 1250,
  rank: 1,
  totalLikeContributions: "2,847 HBAR",
  averageLikeAmount: "1.0 HBAR",
  favoriteArtist: "Priya Sharma",
  favoriteCulture: "Indian",
}

const ownedNFTs = [
  {
    id: 1,
    title: "Sacred Geometry",
    artist: "Priya Sharma",
    culture: "Indian",
    purchasePrice: "750 HBAR",
    currentValue: "1,200 HBAR",
    likes: 234,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    title: "Dragon Dance",
    artist: "Li Wei",
    culture: "Chinese",
    purchasePrice: "1,200 HBAR",
    currentValue: "1,800 HBAR",
    likes: 189,
    image: "/placeholder.svg?height=200&width=200",
  },
]

const recentActivity = [
  { type: "like", description: "Liked 'Ancestral Masks' by Kwame Asante", points: 10, time: "2 hours ago" },
  { type: "purchase", description: "Purchased 'Henna Patterns' NFT", points: 100, time: "1 day ago" },
  { type: "bid", description: "Placed bid on 'Samurai Honor'", points: 50, time: "2 days ago" },
  { type: "reward", description: "Reached Diamond tier", points: 500, time: "1 week ago" },
]

const likeHistory = [
  {
    id: 1,
    artworkTitle: "Sacred Geometry of Mandala",
    artist: "Priya Sharma",
    culture: "Indian",
    amount: "1.0 HBAR",
    date: "2024-01-15",
    time: "14:30",
    transactionId: "0.0.123456@1705320600.123456789",
    image: "/placeholder.svg?height=60&width=60",
    artworkLikes: 234,
    pointsEarned: 10,
  },
  {
    id: 2,
    artworkTitle: "Dragon Dance Heritage",
    artist: "Li Wei",
    culture: "Chinese",
    amount: "1.0 HBAR",
    date: "2024-01-14",
    time: "16:45",
    transactionId: "0.0.123456@1705234200.987654321",
    image: "/placeholder.svg?height=60&width=60",
    artworkLikes: 189,
    pointsEarned: 10,
  },
  {
    id: 3,
    artworkTitle: "Ancestral Masks",
    artist: "Kwame Asante",
    culture: "African",
    amount: "1.0 HBAR",
    date: "2024-01-13",
    time: "10:20",
    transactionId: "0.0.123456@1705147800.456789123",
    image: "/placeholder.svg?height=60&width=60",
    artworkLikes: 156,
    pointsEarned: 10,
  },
  {
    id: 4,
    artworkTitle: "Henna Patterns of Joy",
    artist: "Fatima Al-Zahra",
    culture: "Middle Eastern",
    amount: "1.0 HBAR",
    date: "2024-01-12",
    time: "09:15",
    transactionId: "0.0.123456@1705061400.789123456",
    image: "/placeholder.svg?height=60&width=60",
    artworkLikes: 456,
    pointsEarned: 10,
  },
  {
    id: 5,
    artworkTitle: "Samurai Honor Code",
    artist: "Takeshi Yamamoto",
    culture: "Japanese",
    amount: "1.0 HBAR",
    date: "2024-01-11",
    time: "18:30",
    transactionId: "0.0.123456@1704975000.321654987",
    image: "/placeholder.svg?height=60&width=60",
    artworkLikes: 389,
    pointsEarned: 10,
  },
  {
    id: 6,
    artworkTitle: "Aztec Sun Calendar",
    artist: "Maria Gonzalez",
    culture: "Mexican",
    amount: "1.0 HBAR",
    date: "2024-01-10",
    time: "12:45",
    transactionId: "0.0.123456@1704888600.654321789",
    image: "/placeholder.svg?height=60&width=60",
    artworkLikes: 312,
    pointsEarned: 10,
  },
]

const monthlyContributions = [
  { month: "January 2024", likes: 847, amount: "847 HBAR", points: 8470 },
  { month: "December 2023", likes: 623, amount: "623 HBAR", points: 6230 },
  { month: "November 2023", likes: 534, amount: "534 HBAR", points: 5340 },
  { month: "October 2023", likes: 456, amount: "456 HBAR", points: 4560 },
  { month: "September 2023", likes: 387, amount: "387 HBAR", points: 3870 },
]

const cultureBreakdown = [
  { culture: "Indian", likes: 456, percentage: 16, amount: "456 HBAR" },
  { culture: "Chinese", likes: 398, percentage: 14, amount: "398 HBAR" },
  { culture: "African", likes: 367, percentage: 13, amount: "367 HBAR" },
  { culture: "Japanese", likes: 334, percentage: 12, amount: "334 HBAR" },
  { culture: "Middle Eastern", likes: 298, percentage: 10, amount: "298 HBAR" },
  { culture: "Mexican", likes: 267, percentage: 9, amount: "267 HBAR" },
  { culture: "Others", likes: 727, percentage: 26, amount: "727 HBAR" },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(userProfile.username)
  const [likeFilter, setLikeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const progressToNext = (userProfile.totalPoints / userProfile.redeemTarget) * 100

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "purchase":
        return <Coins className="h-4 w-4 text-green-500" />
      case "bid":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      case "reward":
        return <Award className="h-4 w-4 text-purple-500" />
      default:
        return <Star className="h-4 w-4 text-gray-500" />
    }
  }

  const filteredLikeHistory = likeHistory.filter((like) => {
    if (likeFilter === "all") return true
    return like.culture.toLowerCase() === likeFilter
  })

  const sortedLikeHistory = [...filteredLikeHistory].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "artist":
        return a.artist.localeCompare(b.artist)
      case "culture":
        return a.culture.localeCompare(b.culture)
      default:
        return 0
    }
  })

  const exportLikeHistory = () => {
    const csvContent = [
      ["Date", "Time", "Artwork", "Artist", "Culture", "Amount", "Points", "Transaction ID"].join(","),
      ...likeHistory.map((like) =>
        [
          like.date,
          like.time,
          `"${like.artworkTitle}"`,
          like.artist,
          like.culture,
          like.amount,
          like.pointsEarned,
          like.transactionId,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "like-history.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={userProfile.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">{userProfile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                  #{userProfile.rank}
                </Badge>
              </div>

              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="text-2xl font-bold"
                      />
                      <Button size="sm" onClick={() => setIsEditing(false)}>
                        Save
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{userProfile.username}</h1>
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Badge className="bg-blue-500 text-white">{userProfile.level}</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {userProfile.totalPoints.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-500">{userProfile.likesGiven}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Likes Given</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">{userProfile.nftsOwned}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">NFTs Owned</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-500">{userProfile.nftsSold}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">NFTs Sold</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progress to next reward</span>
                    <span className="font-medium dark:text-gray-300">
                      {userProfile.totalPoints} / {userProfile.redeemTarget}
                    </span>
                  </div>
                  <Progress value={progressToNext} className="h-3" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {userProfile.redeemTarget - userProfile.totalPoints} points to next tier
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {userProfile.badges.map((badge, index) => (
                    <Badge key={index} variant="outline" className="flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>{badge}</span>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Button variant="outline" className="bg-transparent">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Gift className="mr-2 h-4 w-4" />
                  Redeem Points
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="collection" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 dark:bg-gray-800">
            <TabsTrigger value="collection" className="dark:data-[state=active]:bg-gray-700">
              My Collection
            </TabsTrigger>
            <TabsTrigger value="activity" className="dark:data-[state=active]:bg-gray-700">
              Recent Activity
            </TabsTrigger>
            <TabsTrigger value="like-history" className="dark:data-[state=active]:bg-gray-700">
              Like History
            </TabsTrigger>
            <TabsTrigger value="contributions" className="dark:data-[state=active]:bg-gray-700">
              Contributions
            </TabsTrigger>
            <TabsTrigger value="stats" className="dark:data-[state=active]:bg-gray-700">
              Statistics
            </TabsTrigger>
          </TabsList>

          {/* Collection Tab */}
          <TabsContent value="collection">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownedNFTs.map((nft) => (
                <Card key={nft.id} className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                  <div className="relative">
                    <Image
                      src={nft.image || "/placeholder.svg"}
                      alt={nft.title}
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge variant="secondary" className="absolute top-2 left-2">
                      {nft.culture}
                    </Badge>
                    <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                      <Heart className="h-3 w-3" />
                      <span>{nft.likes}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{nft.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">by {nft.artist}</p>
                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Bought for</span>
                        <div className="font-medium">{nft.purchasePrice}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-500 dark:text-gray-400">Current value</span>
                        <div className="font-medium text-green-600">{nft.currentValue}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                      </div>
                      <Badge variant="secondary">+{activity.points} pts</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Like History Tab */}
          <TabsContent value="like-history">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <CardTitle className="flex items-center space-x-2 dark:text-white">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>Complete Like History</span>
                    <Badge variant="secondary">{likeHistory.length} likes</Badge>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Select value={likeFilter} onValueChange={setLikeFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by culture" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cultures</SelectItem>
                        <SelectItem value="indian">Indian</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                        <SelectItem value="african">African</SelectItem>
                        <SelectItem value="japanese">Japanese</SelectItem>
                        <SelectItem value="middle eastern">Middle Eastern</SelectItem>
                        <SelectItem value="mexican">Mexican</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="artist">Artist</SelectItem>
                        <SelectItem value="culture">Culture</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={exportLikeHistory} className="bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedLikeHistory.map((like) => (
                    <div
                      key={like.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="relative">
                        <Image
                          src={like.image || "/placeholder.svg"}
                          alt={like.artworkTitle}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                        <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
                          <Heart className="h-3 w-3 text-white fill-current" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">{like.artworkTitle}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">by {like.artist}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {like.culture}
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {like.date} at {like.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="font-bold text-red-600 dark:text-red-400">{like.amount}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">+{like.pointsEarned} pts</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-24">
                          {like.transactionId.split("@")[0]}...
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {sortedLikeHistory.length === 0 && (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No likes found for the selected filter.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contributions Tab */}
          <TabsContent value="contributions">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Contributions */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 dark:text-white">
                    <Coins className="h-5 w-5 text-yellow-500" />
                    <span>Monthly Contributions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyContributions.map((month, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{month.month}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{month.likes} likes given</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-yellow-600 dark:text-yellow-400">{month.amount}</div>
                          <div className="text-sm text-purple-600 dark:text-purple-400">+{month.points} pts</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Culture Breakdown */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 dark:text-white">
                    <Star className="h-5 w-5 text-purple-500" />
                    <span>Contributions by Culture</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cultureBreakdown.map((culture, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900 dark:text-white">{culture.culture}</span>
                          <div className="text-right">
                            <span className="font-bold text-purple-600 dark:text-purple-400">{culture.amount}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                              ({culture.likes} likes)
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${culture.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{culture.percentage}% of total</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contribution Summary */}
              <Card className="lg:col-span-2 dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 dark:text-white">
                    <Award className="h-5 w-5 text-green-500" />
                    <span>Contribution Impact</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-500 mb-2">{userProfile.totalLikeContributions}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Contributed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-500 mb-2">{userProfile.averageLikeAmount}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Average per Like</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-500 mb-2">{userProfile.favoriteArtist}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Most Supported Artist</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-500 mb-2">{userProfile.favoriteCulture}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Favorite Culture</div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Community Impact</h4>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      Your {userProfile.likesGiven} likes have contributed {userProfile.totalLikeContributions} to the
                      community reward pool, helping support {Math.floor(userProfile.likesGiven / 10)} different artists
                      and their cultural heritage projects. Thank you for being an active community member! 🎨✨
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Financial Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Spent</span>
                    <span className="font-bold text-red-600">{userProfile.totalSpent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Earned</span>
                    <span className="font-bold text-green-600">{userProfile.totalEarned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Like Contributions</span>
                    <span className="font-bold text-red-500">{userProfile.totalLikeContributions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Net Position</span>
                    <span className="font-bold text-blue-600">-6,377 HBAR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Portfolio Value</span>
                    <span className="font-bold text-purple-600">15,200 HBAR</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Community Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Community Rank</span>
                    <span className="font-bold text-yellow-600">#{userProfile.rank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Weekly Points</span>
                    <span className="font-bold text-green-600">+{userProfile.weeklyPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                    <span className="font-bold dark:text-gray-300">{userProfile.joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Badges Earned</span>
                    <span className="font-bold text-purple-600">{userProfile.badges.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Artists Supported</span>
                    <span className="font-bold text-blue-600">{Math.floor(userProfile.likesGiven / 10)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
