"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Coins, Clock, TrendingUp, AlertCircle, CheckCircle, Wallet } from "lucide-react"
import { hederaClient } from "@/lib/hedera-client"

interface Artwork {
  id: number
  title: string
  artist: string
  culture: string
  price: string
  highestBid?: string | null
  timeLeft?: string | null
  image: string
  isAuction?: boolean
}

interface BidModalProps {
  isOpen: boolean
  onClose: () => void
  artwork: Artwork | null
}

export function BidModal({ isOpen, onClose, artwork }: BidModalProps) {
  const [bidAmount, setBidAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  if (!artwork) return null

  const currentPrice = artwork.highestBid
    ? Number.parseFloat(artwork.highestBid.replace(" HBAR", ""))
    : Number.parseFloat(artwork.price.replace(" HBAR", ""))

  const minimumBid = artwork.isAuction ? currentPrice + 50 : currentPrice
  const bidAmountNum = Number.parseFloat(bidAmount) || 0
  const platformFee = bidAmountNum * 0.025 // 2.5% platform fee
  const totalCost = bidAmountNum + platformFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (bidAmountNum < minimumBid) {
      setError(`Minimum ${artwork.isAuction ? "bid" : "price"} is ${minimumBid} HBAR`)
      return
    }

    if (bidAmountNum > 10000) {
      setError("Maximum bid amount is 10,000 HBAR")
      return
    }

    setIsSubmitting(true)

    try {
      if (artwork.isAuction) {
        await hederaClient.placeBid(`auction_${artwork.id}`, bidAmountNum)
      } else {
        // Handle direct purchase
        await hederaClient.purchaseNFT(artwork.id.toString(), bidAmountNum)
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setBidAmount("")
      }, 2000)
    } catch (err) {
      setError("Transaction failed. Please try again.")
      console.error("Bid/Purchase failed:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      setBidAmount("")
      setError("")
      setSuccess(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-purple-600" />
            <span>{artwork.isAuction ? "Place Bid" : "Purchase NFT"}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Artwork Preview */}
          <div className="flex space-x-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                src={artwork.image || "/placeholder.svg"}
                alt={artwork.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{artwork.title}</h3>
              <p className="text-sm text-gray-600">by {artwork.artist}</p>
              <Badge variant="outline" className="mt-1">
                {artwork.culture}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Current Price Info */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{artwork.isAuction ? "Current Highest Bid" : "Fixed Price"}</span>
              <span className="font-bold text-lg text-purple-600">{artwork.highestBid || artwork.price}</span>
            </div>

            {artwork.timeLeft && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Time Remaining</span>
                <div className="flex items-center space-x-1 text-orange-600">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{artwork.timeLeft}</span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Minimum {artwork.isAuction ? "Bid" : "Price"}</span>
              <span className="font-medium text-green-600">{minimumBid} HBAR</span>
            </div>
          </div>

          <Separator />

          {/* Bid Form */}
          {success ? (
            <div className="text-center py-6">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-700 mb-2">
                {artwork.isAuction ? "Bid Placed Successfully!" : "Purchase Successful!"}
              </h3>
              <p className="text-sm text-gray-600">
                {artwork.isAuction
                  ? "Your bid has been submitted to the blockchain."
                  : "The NFT has been transferred to your wallet."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="bidAmount">{artwork.isAuction ? "Your Bid Amount" : "Purchase Amount"} (HBAR)</Label>
                <div className="relative mt-1">
                  <Input
                    id="bidAmount"
                    type="number"
                    step="1"
                    min={minimumBid}
                    max="10000"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`${minimumBid}`}
                    className="pr-16"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 text-sm">HBAR</span>
                  </div>
                </div>
                {bidAmountNum > 0 && bidAmountNum < minimumBid && (
                  <p className="text-sm text-red-600 mt-1">Amount must be at least {minimumBid} HBAR</p>
                )}
              </div>

              {/* Cost Breakdown */}
              {bidAmountNum > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <h4 className="font-medium text-gray-900">Cost Breakdown</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{artwork.isAuction ? "Bid Amount" : "NFT Price"}</span>
                      <span>{bidAmountNum} HBAR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform Fee (2.5%)</span>
                      <span>{platformFee.toFixed(2)} HBAR</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total Cost</span>
                      <span>{totalCost.toFixed(2)} HBAR</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Wallet Balance Warning */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-700">
                  <Wallet className="h-4 w-4" />
                  <span className="text-sm">
                    Ensure you have sufficient HBAR balance: {totalCost.toFixed(2)} HBAR required
                  </span>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || bidAmountNum < minimumBid}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      {artwork.isAuction ? `Bid ${bidAmountNum} HBAR` : `Buy for ${bidAmountNum} HBAR`}
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
