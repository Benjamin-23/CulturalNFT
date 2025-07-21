import { Hero } from "@/components/hero"
import { FeaturedArt } from "@/components/featured-art"
import { TrendingArt } from "@/components/trending-art"
import { CommunityStats } from "@/components/community-stats"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Hero />
      <CommunityStats />
      <FeaturedArt />
      <TrendingArt />
    </div>
  )
}
