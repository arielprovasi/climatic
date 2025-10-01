import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Headers de segurança
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                ],
            },
        ];
    },
    // Configuração de imagens se necessário no futuro
    images: {
        domains: ['openweathermap.org'],
    },
};

export default nextConfig;
