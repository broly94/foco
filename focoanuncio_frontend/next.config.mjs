/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		unoptimized: true,
	},
	// Desactivar cache en desarrollo
	experimental: {
		staleTimes: {
			dynamic: 0, // No cachear rutas dinámicas
			static: 0, // No cachear rutas estáticas
		},
	},
	// Headers para evitar cache
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'no-store, max-age=0',
					},
				],
			},
		];
	},
};

export default nextConfig;
