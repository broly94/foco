"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

// Datos de ejemplo para los anuncios
const ads = [
  {
    id: 1,
    imageUrl: "/placeholder.svg?height=400&width=300&text=Anuncio+1",
    title: "Impulsa tu negocio",
    link: "/register?plan=premium",
  },
  {
    id: 2,
    imageUrl: "/placeholder.svg?height=400&width=300&text=Anuncio+2",
    title: "Destaca entre la competencia",
    link: "/register?plan=premium",
  },
  {
    id: 3,
    imageUrl: "/placeholder.svg?height=400&width=300&text=Anuncio+3",
    title: "Aumenta tus ventas",
    link: "/register?plan=premium",
  },
]

export default function RotatingAd() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0)

  useEffect(() => {
    // Cambiar el anuncio cada 30 segundos
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const currentAd = ads[currentAdIndex]

  return (
    <div className="relative">
      <Link href={currentAd.link} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={currentAd.imageUrl || "/placeholder.svg"}
            alt={currentAd.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h4 className="text-white font-medium">{currentAd.title}</h4>
            <p className="text-white/80 text-sm">Espacio publicitario</p>
          </div>
        </div>
      </Link>
      <div className="flex justify-center p-2 gap-1">
        {ads.map((_, index) => (
          <span
            key={index}
            className={`block h-1.5 rounded-full ${
              index === currentAdIndex ? "w-4 bg-emerald-500" : "w-2 bg-gray-300"
            } transition-all duration-300`}
          ></span>
        ))}
      </div>
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">Ad</div>
    </div>
  )
}
