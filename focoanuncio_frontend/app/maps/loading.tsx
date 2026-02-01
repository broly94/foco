export default function Loading() {
  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 text-lg">Cargando mapa...</p>
      </div>
    </div>
  )
}
