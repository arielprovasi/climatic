import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
    title: 'Climatic — Clima em tempo real',
    description: 'Veja clima atual, sensação térmica, umidade e vento da sua cidade.',
    icons: {
        icon: '/favicon.ico',
    },
    openGraph: {
        title: 'Climatic — Clima em tempo real',
        description:
            'Veja clima atual, sensação térmica, umidade e vento da sua cidade.',
        type: 'website',
        locale: 'pt_BR',
        siteName: 'Climatic',
    },
    twitter: {
        card: 'summary',
        title: 'Climatic — Clima em tempo real',
        description:
            'Veja clima atual, sensação térmica, umidade e vento da sua cidade.',
    },
};

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-br">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
