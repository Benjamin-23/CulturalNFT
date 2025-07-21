"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, Coins, Wallet, AlertTriangle, CheckCircle, Sparkles, TrendingUp } from "lucide-react"
import Image from "next/image"

interface Artwork {
  id: number
  title: string
  artist: string
  culture: string
  image: string
  likes: number
}

interface LikeConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (artwork: Artwork) => Promise<void>
  artwork: Artwork | null
}

export function LikeConfirmationDialog({ isOpen, onClose, onConfirm, artwork }: LikeConfirmationDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!artwork) return null

  const handleConfirm = async () => {
    setIsProcessing(true)
    try {
      await onConfirm(artwork)
      setIsSuccess(true)
      setTimeout(() => {
        onClose()
        setIsSuccess(false)
        setIsProcessing(false)
      }, 2000)
    } catch (error) {
      console.error("Like transaction failed:", error)
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    if (!isProcessing) {
      onClose()
      setIsSuccess(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-800 dark:via-purple-900/20 dark:to-blue-900/20 opacity-50" />
        <div className="absolute inset-0">
          <div className="absolute top-4 left-4 w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
          <div className="absolute top-8 right-8 w-1 h-1 bg-purple-400 rounded-full animate-ping" />
          <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
        </div>

        <div className="relative z-10">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center space-x-2 text-center">
              <div className="relative">
                <Heart className="h-6 w-6 text-red-500 animate-pulse" />
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 animate-spin" />
              </div>
              <span className="bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                Show Your Love
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {isSuccess ? (
              // Success State
              <div className="text-center py-6">
                <div className="relative mx-auto w-16 h-16 mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto animate-bounce" />
                  <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-25" />
                </div>
                <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">Love Sent! 💖</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your 1 HBAR has been sent to the community wallet
                </p>
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Thank you for supporting "{artwork.title}" and our artist community! ✨
                  </p>
                  <div className="flex items-center justify-center space-x-4 mt-2 text-xs text-green-600 dark:text-green-400">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>+10 Points Earned</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>Added to Like History</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Confirmation State
              <>
                {/* Artwork Preview */}
                <div className="flex items-center space-x-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                  <div className="relative">
                    <Image
                      src={artwork.image || "/placeholder.svg"}
                      alt={artwork.title}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                    <div className="absolute -top-2 -right-2">
                      <Heart className="h-4 w-4 text-red-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{artwork.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">by {artwork.artist}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {artwork.culture}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-red-500">
                      <Heart className="h-4 w-4" />
                      <span className="font-medium">{artwork.likes}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Transaction Details */}
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Confirm Your Support</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Show your appreciation for this cultural artwork
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Coins className="h-5 w-5 text-yellow-500" />
                        <span className="font-medium text-gray-900 dark:text-white">Like Payment</span>
                      </div>
                      <span className="text-xl font-bold text-purple-600 dark:text-purple-400">1 HBAR</span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Destination:</span>
                        <span className="font-medium text-gray-900 dark:text-white">Community Wallet</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Purpose:</span>
                        <span className="font-medium text-gray-900 dark:text-white">Artist Support</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Network Fee:</span>
                        <span className="font-medium text-gray-900 dark:text-white">~0.001 HBAR</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Points Earned:</span>
                        <span className="font-medium text-purple-600 dark:text-purple-400">+10 Points</span>
                      </div>
                    </div>
                  </div>

                  {/* Important Notice */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <h4 className="font-medium text-amber-800 dark:text-amber-300">Important Notice</h4>
                        <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                          <li>• Once you like an artwork, you cannot unlike it</li>
                          <li>• Your HBAR will be sent to the community reward pool</li>
                          <li>• This helps fund rewards for popular artworks</li>
                          <li>• This transaction will be added to your like history</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Balance Check */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                      <Wallet className="h-4 w-4" />
                      <span className="text-sm">
                        Ensure you have at least 1.01 HBAR in your wallet for this transaction
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={isProcessing}
                    className="flex-1 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending Love...
                      </>
                    ) : (
                      <>
                        <Heart className="mr-2 h-4 w-4" />
                        Send 1 HBAR ❤️
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
