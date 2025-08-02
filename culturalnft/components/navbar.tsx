"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Wallet, Menu, X, Palette, GalleryThumbnailsIcon as Gallery, User, Trophy, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { hederaClient } from "@/lib/hedera-client"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(false) // Set to true for demo
  const [accountId, setAccountId] = useState("0.0.1234")
  const [username] = useState("ArtCollector2024")
  const [userPoints] = useState(15420)
  const [notifications] = useState(3)
  const [balance, setBalance] = useState('') // Example balance in HBAR

  const connectWallet = async () => {
    try {
      // HashPack wallet connection logic would go here

      const connectAccount = await hederaClient.connectWallet()
      console.log("Connected to HashPack wallet:", connectAccount)
      // Simulate successful connection
      if (!connectAccount) {
        throw new Error("Failed to connect to HashPack wallet")
      }
      setBalance(connectAccount?.balance)
      setIsConnected(true)
      console.log("Connecting to HashPack wallet...")
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Palette className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              CulturalNFT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/gallery"
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 flex items-center space-x-1"
            >
              <Gallery className="h-4 w-4" />
              <span>Gallery</span>
            </Link>
            <Link
              href="/mint"
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 flex items-center space-x-1"
            >
              <Palette className="h-4 w-4" />
              <span>Mint</span>
            </Link>
            <Link
              href="/profile"
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 flex items-center space-x-1"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
            <Link
              href="/community"
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 flex items-center space-x-1"
            >
              <Trophy className="h-4 w-4" />
              <span>Community</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {isConnected ? (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                      {notifications}
                    </Badge>
                  )}
                </Button>

                {/* User Profile */}
                <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">{username}</div>
                    <div className="text-purple-600 dark:text-purple-400">{userPoints.toLocaleString()} pts</div>
                  </div>
                </div>

                {/* Wallet Info */}
                <div className="flex items-center space-x-2">
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">
                    {accountId}
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm">
                    {balance ? `${balance} HBAR` : "Loading..." }
                  </div>
                </div>
              </div>
            ) : (
              <Button onClick={connectWallet} className="bg-gradient-to-r from-purple-600 to-pink-600">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t dark:border-gray-700">
            <Link
              href="/gallery"
              className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            >
              Gallery
            </Link>
            <Link
              href="/mint"
              className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            >
              Mint
            </Link>
            <Link
              href="/profile"
              className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            >
              Profile
            </Link>
            <Link
              href="/community"
              className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            >
              Community
            </Link>

            {isConnected && (
              <div className="px-3 py-2 space-y-2">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{username}</div>
                    <div className="text-sm text-purple-600 dark:text-purple-400">
                      {userPoints.toLocaleString()} points
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{accountId} • 1,250 HBAR</div>
              </div>
            )}

            {!isConnected && (
              <div className="px-3">
                <Button onClick={connectWallet} className="w-full">
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
