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
    description: 'Veja clima atual, sensação térmica, umidade e vento da sua cidade.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Climatic',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Climatic — Clima em tempo real',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Climatic — Clima em tempo real',
    description: 'Veja clima atual, sensação térmica, umidade e vento da sua cidade.',
    images: ['/og-image.svg'],
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
