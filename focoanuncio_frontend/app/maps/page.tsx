"use client"

import { useState } from "react"
import { Search, MapPin, List, MapIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import MapComponent from "@/components/map-component"

export default function MapsPage() {
  const [keyword, setKeyword] = useState("")
  const [isMobileListVisible, setIsMobileListVisible] = useState(false)

  // Datos de ejemplo para los marcadores del mapa
  const markers = Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1,
    title: `Estrategia de Marketing #${i + 1}`,
    lat: -34.6037 + (Math.random() - 0.5) * 0.1,
    lng: -58.3816 + (Math.random() - 0.5) * 0.1,
    rating: 4 + Math.random(),
    category: "Marketing Digital",
    address: "Buenos Aires, Argentina",
  }))

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-col md:flex-row h-full">
        {/* Mapa (70% en escritorio, 100% en móvil cuando la lista está oculta) */}
        <div className={`${isMobileListVisible ? "hidden" : "flex"} md:flex md:w-[70%] h-full flex-col relative`}>
          <MapComponent markers={markers} />

          {/* Botón para mostrar la lista en móvil */}
          <Button
            className="md:hidden absolute bottom-4 right-4 z-10 rounded-full w-12 h-12 p-0 shadow-lg"
            onClick={() => setIsMobileListVisible(true)}
          >
            <List className="h-6 w-6" />
          </Button>
        </div>

        {/* Lista de resultados (30% en escritorio, 100% en móvil cuando está visible) */}
        <div
          className={`${
            isMobileListVisible ? "flex" : "hidden"
          } md:flex md:w-[30%] h-full flex-col border-l border-gray-200 bg-white overflow-hidden`}
        >
          <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar por palabras clave"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Botón para mostrar el mapa en móvil */}
            <Button
              variant="outline"
              className="md:hidden mt-2 w-full flex items-center justify-center"
              onClick={() => setIsMobileListVisible(false)}
            >
              <MapIcon className="h-4 w-4 mr-2" />
              Ver mapa
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {markers.map((marker) => (
              <div key={marker.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                <Link href={`/strategy/${marker.id}`} className="block">
                  <h3 className="font-medium text-gray-900 hover:text-emerald-600">{marker.title}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                    <span>{marker.address}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(marker.rating) ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-sm text-gray-600">{marker.rating.toFixed(1)}</span>
                    </div>
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-800">
                      {marker.category}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
