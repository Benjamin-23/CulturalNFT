import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Users, Coins, Heart } from "lucide-react"

export function CommunityStats() {
  return (
    <section className="py-12 px-4 bg-white/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">2,847</h3>
              <p className="text-gray-600">Active Artists</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">15,632</h3>
              <p className="text-gray-600">NFTs Minted</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">45,890</h3>
              <p className="text-gray-600">HBAR in Community Pool</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">128,456</h3>
              <p className="text-gray-600">Total Likes Given</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
