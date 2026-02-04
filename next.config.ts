/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimizações
  swcMinify: true,
  compress: true,
  poweredByHeader: false,

  // Configurações de imagem (se usar Next Image)
  images: {
    domains: ['https://bot-prototype.onrender.com'],
    formats: ['image/avif', 'image/webp'],
  },

  // Headers de segurança
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
    ]
  },

  // Redirecionamentos (se necessário)
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
