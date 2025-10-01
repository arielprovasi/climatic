'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CloudSun } from 'lucide-react';

/**
 * Componente memoizado para exibir o conteúdo estático do cabeçalho.
 * Evita re-renderizações desnecessárias quando o estado do componente pai (WeatherHeader) muda.
 */
const StaticHeaderContent = React.memo(() => {
    return (
        <>
            <Link href="/" className="flex items-center justify-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-2xl">
                    <CloudSun className="w-8 h-8 text-white" />
                </div>
                <Image
                    src="/ClimaticLogo.svg"
                    alt="Climatic Logo"
                    width={160}
                    height={40}
                    priority
                    className="drop-shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
                />
            </Link>
            <p className="text-white/90 text-base md:text-lg font-light tracking-wide">
                Meteorologia intuitiva, elegante e precisa
            </p>
        </>
    );
});

StaticHeaderContent.displayName = 'StaticHeaderContent';

export default StaticHeaderContent;
