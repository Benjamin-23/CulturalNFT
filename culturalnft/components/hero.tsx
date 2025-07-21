import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Palette, Coins, Heart } from "lucide-react"

export function Hero() {
  return (
    <section className="relative py-20 px-4 text-center">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6">
          Cultural NFT Marketplace
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Discover, collect, and trade unique cultural art NFTs on Hedera. Support artists, build your collection, and
          participate in our vibrant community rewards system.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link href="/mint">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Palette className="mr-2 h-5 w-5" />
              Mint Your Art
            </Button>
          </Link>
          <Link href="/gallery">
            <Button size="lg" variant="outline">
              Explore Gallery
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Mint & Share</h3>
            <p className="text-gray-600">Create NFTs of your cultural art with rich storytelling</p>
          </div>

          <div className="text-center">
            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coins className="h-8 w-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Bid & Collect</h3>
            <p className="text-gray-600">Participate in auctions and build your unique collection</p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Like & Earn</h3>
            <p className="text-gray-600">Support artists with likes and earn community rewards</p>
          </div>
        </div>
      </div>
    </section>
  )
}
