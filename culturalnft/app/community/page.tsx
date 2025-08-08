"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  TrendingUp,
  Heart,
  Crown,
  Award,
  Coins,
  Users,
  ArrowUp,
  ArrowDown,
  Gift,
  Star,
} from "lucide-react";
import Image from "next/image";

const topArtworks = [
  {
    id: 1,
    title: "Sacred Geometry of Mandala",
    artist: "Priya Sharma",
    culture: "Indian",
    likes: 2847,
    value: "1,250 HBAR",
    valueIncrease: "+45%",
    trend: "up",
    image: "/images/indian-mandala1.jpg",
    rank: 1,
    weeklyGrowth: 234,
  },
  {
    id: 2,
    title: "Dragon Dance Heritage",
    artist: "Li Wei",
    culture: "Chinese",
    likes: 2156,
    value: "980 HBAR",
    valueIncrease: "+32%",
    trend: "up",
    image: "/images/chinese-dragon.jpg",
    rank: 2,
    weeklyGrowth: 189,
  },
  {
    id: 3,
    title: "Ancestral Masks",
    artist: "Kwame Asante",
    culture: "African",
    likes: 1987,
    value: "850 HBAR",
    valueIncrease: "+28%",
    trend: "up",
    image: "/images/african-masks.jpg",
    rank: 3,
    weeklyGrowth: 156,
  },
  {
    id: 4,
    title: "Henna Patterns of Joy",
    artist: "Fatima Al-Zahra",
    culture: "Middle Eastern",
    likes: 1654,
    value: "720 HBAR",
    valueIncrease: "-5%",
    trend: "down",
    image: "/images/middle-eastern-henna.jpg",
    rank: 4,
    weeklyGrowth: -23,
  },
];

const topUsers = [
  {
    id: 1,
    username: "ArtCollector2024",
    avatar: "/placeholder.svg?height=40&width=40",
    totalPoints: 15420,
    likesGiven: 2847,
    nftsOwned: 23,
    redeemTarget: 20000,
    level: "Diamond",
    rank: 1,
    weeklyPoints: 1250,
    badges: ["Top Collector", "Culture Enthusiast", "Community Leader"],
  },
  {
    id: 2,
    username: "CultureLover",
    avatar: "/placeholder.svg?height=40&width=40",
    totalPoints: 12890,
    likesGiven: 1923,
    nftsOwned: 18,
    redeemTarget: 15000,
    level: "Gold",
    rank: 2,
    weeklyPoints: 890,
    badges: ["Art Supporter", "Active Member"],
  },
  {
    id: 3,
    username: "NFTExplorer",
    avatar: "/placeholder.svg?height=40&width=40",
    totalPoints: 9876,
    likesGiven: 1654,
    nftsOwned: 12,
    redeemTarget: 10000,
    level: "Silver",
    rank: 3,
    weeklyPoints: 567,
    badges: ["Explorer", "Trendsetter"],
  },
  {
    id: 4,
    username: "DigitalArtFan",
    avatar: "/placeholder.svg?height=40&width=40",
    totalPoints: 7543,
    likesGiven: 1234,
    nftsOwned: 8,
    redeemTarget: 10000,
    level: "Bronze",
    rank: 4,
    weeklyPoints: 432,
    badges: ["Art Fan"],
  },
];

const rewardTiers = [
  {
    name: "Bronze Tier",
    points: 1000,
    rewards: [
      "5% discount on platform fees",
      "Bronze badge",
      "Early access to new drops",
    ],
    color: "bg-amber-600",
  },
  {
    name: "Silver Tier",
    points: 5000,
    rewards: [
      "10% discount on platform fees",
      "Silver badge",
      "Exclusive community events",
    ],
    color: "bg-gray-400",
  },
  {
    name: "Gold Tier",
    points: 15000,
    rewards: [
      "15% discount on platform fees",
      "Gold badge",
      "Priority customer support",
    ],
    color: "bg-yellow-500",
  },
  {
    name: "Diamond Tier",
    points: 25000,
    rewards: [
      "20% discount on platform fees",
      "Diamond badge",
      "VIP access to artist events",
    ],
    color: "bg-blue-500",
  },
];

export default function CommunityPage() {
  const [selectedTab, setSelectedTab] = useState("artworks");

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Diamond":
        return "bg-blue-500";
      case "Gold":
        return "bg-yellow-500";
      case "Silver":
        return "bg-gray-400";
      case "Bronze":
        return "bg-amber-600";
      default:
        return "bg-gray-500";
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Award className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-5 w-5 text-amber-600" />;
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Community Hub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Discover trending artworks, top collectors, and earn rewards
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                12,847
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active Members
              </div>
            </CardContent>
          </Card>
          <Card className="text-center dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                156,432
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Likes Given
              </div>
            </CardContent>
          </Card>
          <Card className="text-center dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <Coins className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                89,567
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                HBAR in Rewards Pool
              </div>
            </CardContent>
          </Card>
          <Card className="text-center dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <Trophy className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                2,456
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Rewards Claimed
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-3 dark:bg-gray-800">
            <TabsTrigger
              value="artworks"
              className="dark:data-[state=active]:bg-gray-700"
            >
              Leading Artworks
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="dark:data-[state=active]:bg-gray-700"
            >
              Top Users
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="dark:data-[state=active]:bg-gray-700"
            >
              Reward System
            </TabsTrigger>
          </TabsList>

          {/* Leading Artworks Tab */}
          <TabsContent value="artworks" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-white">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                  <span>Most Liked & Trending Artworks</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topArtworks.map((artwork) => (
                    <div
                      key={artwork.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-3">
                        {getRankIcon(artwork.rank)}
                        <div className="relative">
                          <Image
                            src={artwork.image || "/placeholder.svg"}
                            alt={artwork.title}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover"
                          />
                          <Badge
                            variant="secondary"
                            className="absolute -top-2 -right-2 text-xs"
                          >
                            {artwork.culture}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                          {artwork.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          by {artwork.artist}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span className="text-sm font-medium dark:text-gray-300">
                              {artwork.likes}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {artwork.trend === "up" ? (
                              <ArrowUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <ArrowDown className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {artwork.weeklyGrowth > 0 ? "+" : ""}
                              {artwork.weeklyGrowth} this week
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {artwork.value}
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            artwork.trend === "up"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {artwork.valueIncrease}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Top Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-white">
                  <Users className="h-6 w-6 text-blue-500" />
                  <span>Community Leaderboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {topUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-4 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-3">
                        {getRankIcon(user.rank)}
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {user.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {user.username}
                          </h4>
                          <Badge
                            className={`${getLevelColor(user.level)} text-white`}
                          >
                            {user.level}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">
                              Total Points
                            </span>
                            <div className="font-bold text-purple-600 dark:text-purple-400">
                              {user.totalPoints.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">
                              Likes Given
                            </span>
                            <div className="font-bold text-red-500">
                              {user.likesGiven.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">
                              NFTs Owned
                            </span>
                            <div className="font-bold text-green-500">
                              {user.nftsOwned}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Progress to next reward
                            </span>
                            <span className="font-medium dark:text-gray-300">
                              {user.totalPoints} / {user.redeemTarget}
                            </span>
                          </div>
                          <Progress
                            value={(user.totalPoints / user.redeemTarget) * 100}
                            className="h-2"
                          />
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {user.badges.map((badge, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              <Star className="h-3 w-3 mr-1" />
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          This Week
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          +{user.weeklyPoints}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Reward Tiers */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 dark:text-white">
                    <Gift className="h-6 w-6 text-purple-500" />
                    <span>Reward Tiers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {rewardTiers.map((tier, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow dark:border-gray-600"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div
                          className={`w-4 h-4 rounded-full ${tier.color}`}
                        ></div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {tier.name}
                        </h4>
                        <Badge variant="outline">
                          {tier.points.toLocaleString()} pts
                        </Badge>
                      </div>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {tier.rewards.map((reward, rewardIndex) => (
                          <li
                            key={rewardIndex}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <span>{reward}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* How to Earn Points */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 dark:text-white">
                    <Coins className="h-6 w-6 text-yellow-500" />
                    <span>How to Earn Points</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Heart className="h-5 w-5 text-red-500" />
                        <span className="text-sm dark:text-gray-300">
                          Like an artwork
                        </span>
                      </div>
                      <Badge variant="secondary">+10 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Coins className="h-5 w-5 text-yellow-500" />
                        <span className="text-sm dark:text-gray-300">
                          Purchase an NFT
                        </span>
                      </div>
                      <Badge variant="secondary">+100 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Trophy className="h-5 w-5 text-green-500" />
                        <span className="text-sm dark:text-gray-300">
                          Win an auction
                        </span>
                      </div>
                      <Badge variant="secondary">+200 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-blue-500" />
                        <span className="text-sm dark:text-gray-300">
                          Refer a friend
                        </span>
                      </div>
                      <Badge variant="secondary">+500 pts</Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t dark:border-gray-600">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                      <Gift className="mr-2 h-4 w-4" />
                      Redeem Rewards
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
