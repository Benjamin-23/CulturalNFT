"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Heart, Eye, QrCode } from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";

const trendingArt = [
  {
    id: 1,
    title: "Henna Patterns of Joy",
    artist: "Fatima Al-Zahra",
    culture: "Middle Eastern",
    likes: 456,
    views: 2340,
    trend: "+45%",
    image: "/images/henna-patterns.jpg",
  },
  {
    id: 2,
    title: "Samurai Honor Code",
    artist: "Takeshi Yamamoto",
    culture: "Japanese",
    likes: 389,
    views: 1876,
    trend: "+38%",
    image: "/images/samurai-art.jpg",
  },
  {
    id: 3,
    title: "Aztec Sun Calendar",
    artist: "Maria Gonzalez",
    culture: "Mexican",
    likes: 312,
    views: 1654,
    trend: "+32%",
    image: "/images/aztec-calendar.jpg",
  },
  {
    id: 4,
    title: "Celtic Knot Wisdom",
    artist: "Sean O'Brien",
    culture: "Celtic",
    likes: 278,
    views: 1432,
    trend: "+28%",
    image: "/images/celtic-knot.jpg",
  },
];

export function TrendingArt() {
  const [showQRCode, setShowQRCode] = useState<number | null>(null);

  const toggleQRCode = (id: number) => {
    setShowQRCode(showQRCode === id ? null : id);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <h2 className="text-4xl font-bold text-gray-900">
              Trending This Week
            </h2>
          </div>
          <p className="text-xl text-gray-600">
            Most liked and viewed cultural artworks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingArt.map((artwork, index) => (
            <Card
              key={artwork.id}
              className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-green-500 text-white">#{index + 1}</Badge>
              </div>
              <div className="absolute top-4 right-4 z-10">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  {artwork.trend}
                </Badge>
              </div>

              <div className="relative">
                {showQRCode === artwork.id ? (
                  <div className="w-full h-48 bg-white flex items-center justify-center p-4">
                    <QRCode
                      value={`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}${artwork.image}`}
                      size={180}
                      level="H"
                    />
                  </div>
                ) : (
                  <Image
                    src={artwork.image}
                    alt={artwork.title}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>

              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline">{artwork.culture}</Badge>
                  <button
                    onClick={() => toggleQRCode(artwork.id)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Toggle QR code"
                  >
                    <QrCode className="h-5 w-5" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {artwork.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  by {artwork.artist}
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-1 text-red-500">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm font-medium">{artwork.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">{artwork.views}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
