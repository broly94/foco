"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

// Componente de mapa simplificado que usa un iframe de OpenStreetMap
export default function MapComponent({ markers }: { markers: any[] }) {
  const [selectedMarker, setSelectedMarker] = useState<any | null>(null)

  // Posición inicial del mapa (Buenos Aires, Argentina)
  const initialLat = -34.6037
  const initialLng = -58.3816
  const zoom = 13

  // URL base para el iframe de OpenStreetMap
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${initialLng - 0.1}%2C${initialLat - 0.1}%2C${initialLng + 0.1}%2C${initialLat + 0.1}&layer=mapnik&marker=${initialLat}%2C${initialLng}`

  return (
    <div className="w-full h-full relative bg-gray-100">
      {/* Iframe del mapa */}
      <iframe src={mapUrl} className="w-full h-full border-0" title="Mapa de estrategias" loading="lazy"></iframe>

      {/* Marcadores simulados sobre el mapa */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full">
          {markers.map((marker) => {
            // Convertir coordenadas geográficas a posición en la pantalla (aproximado)
            const left = ((marker.lng - (initialLng - 0.1)) / 0.2) * 100
            const top = 100 - ((marker.lat - (initialLat - 0.1)) / 0.2) * 100

            return (
              <div
                key={marker.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                style={{ left: `${left}%`, top: `${top}%` }}
                onClick={() => setSelectedMarker(marker)}
              >
                <div className="bg-emerald-500 text-white rounded-full p-1 cursor-pointer hover:bg-emerald-600 transition-colors">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Popup para el marcador seleccionado */}
      {selectedMarker && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-lg z-10 max-w-xs">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => setSelectedMarker(null)}
          >
            ×
          </button>
          <h3 className="font-medium text-base">{selectedMarker.title}</h3>
          <div className="flex items-center mt-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(selectedMarker.rating) ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-xs">{selectedMarker.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="text-xs text-gray-600 mt-1">{selectedMarker.address}</div>
          <Button size="sm" className="w-full mt-2 text-xs py-1" asChild>
            <a href={`/strategy/${selectedMarker.id}`}>Ver detalles</a>
          </Button>
        </div>
      )}

      {/* Botón para centrar en la ubicación actual (simulado) */}
      <Button
        className="absolute bottom-4 left-4 z-10 rounded-full w-10 h-10 p-0 shadow-lg"
        onClick={() => alert("Esta función requiere acceso a tu ubicación")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </Button>
    </div>
  )
}
