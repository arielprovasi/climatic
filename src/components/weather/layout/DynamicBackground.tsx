'use client';

import React, { useMemo, useEffect, useRef, useState } from 'react';
import type { WeatherIcon } from '@/services/WeatherService';
import { getGradientStyle } from '@/lib/gradient';

type Props = {
    children: React.ReactNode;
    weatherIcon: WeatherIcon | undefined;
    isDayTime: boolean;
};

type AnimationElement = {
    id: number;
    className: string;
    style: React.CSSProperties;
};

// Configuração declarativa para os elementos de animação
const animationConfig: Record<WeatherIcon, (isDay: boolean) => AnimationElement[]> = {
    sunny: () => [
        { id: 1, className: 'absolute top-20 right-20 w-32 h-32 bg-yellow-300/30 rounded-full blur-sm sun-rays', style: { animationDelay: '0s' } },
        { id: 2, className: 'absolute top-32 right-32 w-24 h-24 bg-orange-300/25 rounded-full blur-md sun-rays', style: { animationDirection: 'reverse', animationDelay: '5s' } },
        { id: 3, className: 'absolute top-16 right-16 w-40 h-40 bg-yellow-200/20 rounded-full blur-lg sun-glow', style: { animationDelay: '2s' } },
        { id: 4, className: 'absolute bottom-20 left-20 w-28 h-28 bg-orange-200/10 rounded-full blur-md sun-glow', style: { animationDelay: '3s' } },
    ],
    cloudy: () => [
        { id: 1, className: 'absolute top-16 left-1/4 w-48 h-24 bg-white/20 rounded-full blur-lg cloudy-animation', style: { animationDelay: '0s' } },
        { id: 2, className: 'absolute top-32 right-1/4 w-40 h-20 bg-white/20 rounded-full blur-md cloudy-animation', style: { animationDirection: 'reverse', animationDelay: '3s' } },
        { id: 3, className: 'absolute bottom-40 left-1/3 w-56 h-28 bg-white/10 rounded-full blur-xl cloudy-animation', style: { animationDelay: '6s' } },
        { id: 4, className: 'absolute top-1/3 left-1/6 w-24 h-12 bg-white/10 rounded-full blur-sm cloudy-drift', style: { animationDelay: '2s' } },
        { id: 5, className: 'absolute top-2/3 right-1/6 w-32 h-16 bg-white/10 rounded-full blur-md cloudy-drift', style: { animationDirection: 'reverse', animationDelay: '8s' } },
    ],
    'partly-cloudy': (isDay) => [
        // Pega um elemento do 'sunny' se for dia e remapeia o ID para evitar colisão com os IDs locais (1..3)
        ...(isDay ? animationConfig.sunny(isDay).slice(0, 1).map((e) => ({ ...e, id: 100 })) : []),
        { id: 1, className: 'absolute top-20 left-0 w-32 h-16 bg-white/20 rounded-full blur-md cloud-pass', style: { animationDelay: '0s' } },
        { id: 2, className: 'absolute top-32 right-0 w-40 h-20 bg-white/20 rounded-full blur-lg cloud-pass', style: { animationDirection: 'reverse', animationDelay: '8s' } },
        { id: 3, className: 'absolute bottom-1/4 left-1/5 w-20 h-10 bg-white/10 rounded-full blur-sm cloudy-animation', style: { animationDelay: '12s' } },
        ],
        rainy: () => [
        ...Array.from({ length: 15 }, (_, i) => ({
            id: i,
            className: 'absolute w-1 h-8 bg-blue-300/75 rounded-full blur-sm rain-fall',
            style: { left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s` },
        })),
        ],
        stormy: () => [
        { id: 1, className: 'absolute top-1/4 left-1/3 w-2 h-32 bg-white/90 rounded-full blur-sm lightning-flash', style: { animationDelay: '0s' } },
        { id: 2, className: 'absolute top-1/3 right-1/4 w-1 h-24 bg-white/80 rounded-full blur-sm lightning-flash', style: { animationDelay: '1.5s' } },
        { id: 3, className: 'absolute top-16 left-1/4 w-56 h-32 bg-gray-400/30 rounded-full blur-xl storm-clouds', style: { animationDelay: '0s' } },
        { id: 4, className: 'absolute top-24 right-1/5 w-48 h-28 bg-gray-500/25 rounded-full blur-lg storm-clouds', style: { animationDelay: '2s' } },
        ],
        snowy: () => [
        ...Array.from({ length: 12 }, (_, i) => ({
            id: i,
            className: 'absolute w-2 h-2 bg-white/80 rounded-full blur-sm snow-fall',
            style: { left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s` },
        })),
        { id: 13, className: 'absolute bottom-0 left-0 w-full h-16 bg-white/20 rounded-t-full blur-lg snow-drift', style: { animationDelay: '0s' } },
        ],
        foggy: () => [
        { id: 1, className: 'absolute top-1/3 left-0 w-full h-20 bg-white/25 rounded-full blur-xl fog-drift', style: { animationDelay: '0s' } },
        { id: 2, className: 'absolute top-1/2 right-0 w-full h-16 bg-white/20 rounded-full blur-lg fog-drift', style: { animationDirection: 'reverse', animationDelay: '5s' } },
        { id: 3, className: 'absolute bottom-1/3 left-0 w-full h-12 bg-white/10 rounded-full blur-md fog-pulse', style: { animationDelay: '3s' } },
        ],
        'clear-night': () => [], // Sem animações específicas para noite clara por enquanto
};

const AnimatedParticle = React.memo(({ className, style }: Omit<AnimationElement, 'id'>) => (
    <div className={className} style={style} />
));
AnimatedParticle.displayName = 'AnimatedParticle';

export default function DynamicBackground({ children, weatherIcon, isDayTime }: Props) {
    // Mantém o último ícone e período (dia/noite) válidos para uso durante o loading (quando weatherIcon vem undefined)
    const lastIconRef = useRef<WeatherIcon | undefined>(undefined);
    const lastIsDayRef = useRef<boolean>(isDayTime);
    // Para crossfade do fundo entre o anterior e o atual
    const [showOverlay, setShowOverlay] = useState(false);
    const [overlayOpacity, setOverlayOpacity] = useState(0);
    const prevBgRef = useRef<{ icon?: WeatherIcon; isDay: boolean } | null>(null);
    const FADE_MS = 2000;
    // Fade-in das partículas ao trocar de clima
    const [particlesOpacity, setParticlesOpacity] = useState(1);
    const prevParticlesKeyRef = useRef<{ icon?: WeatherIcon; isDay: boolean }>({ icon: undefined, isDay: isDayTime });
    // Cache para elementos randômicos (chuva/neve) e evitar reembaralhar em mudanças de dia/noite
    const generatedCacheRef = useRef<Partial<Record<WeatherIcon, AnimationElement[]>>>({});

    // Atualiza os "últimos" somente quando um ícone válido é recebido
    useEffect(() => {
        if (weatherIcon) {
            // Se houver um anterior, prepara overlay com o fundo antigo para crossfade
            if (lastIconRef.current) {
                const wasDifferentIcon = lastIconRef.current !== weatherIcon;
                const wasDifferentDay = lastIsDayRef.current !== isDayTime;
                if (wasDifferentIcon || wasDifferentDay) {
                    prevBgRef.current = {
                        icon: lastIconRef.current,
                        isDay: lastIsDayRef.current,
                    };
                    setShowOverlay(true);
                    setOverlayOpacity(1);
                    // Próximo frame, inicia fade-out
                    requestAnimationFrame(() => setOverlayOpacity(0));
                    const t = setTimeout(() => {
                        setShowOverlay(false);
                        prevBgRef.current = null;
                    }, FADE_MS);
                    return () => clearTimeout(t);
                }
            }
            // Atualiza referências do último estado válido
            lastIconRef.current = weatherIcon;
            lastIsDayRef.current = isDayTime;
        }
    }, [weatherIcon, isDayTime]);

    // Fallbacks efetivos a serem usados no estilo e nas partículas
    const effectiveIcon = weatherIcon ?? lastIconRef.current;
    const effectiveIsDay = weatherIcon ? isDayTime : (lastIsDayRef.current ?? isDayTime);

    const backgroundStyle = useMemo(() => ({
        background: getGradientStyle(effectiveIsDay, effectiveIcon),
        transition: 'background 2s ease-in-out',
    }), [effectiveIsDay, effectiveIcon]);

    const animatedElements = useMemo(() => {
        if (!effectiveIcon) return [];
        const generator = animationConfig[effectiveIcon];
        if (!generator) return [];
        const usesRandom = effectiveIcon === 'rainy' || effectiveIcon === 'snowy';
        if (usesRandom) {
            const cached = generatedCacheRef.current[effectiveIcon];
            if (cached) return cached;
            const elems = generator(effectiveIsDay);
            generatedCacheRef.current[effectiveIcon] = elems;
            return elems;
        }
        return generator(effectiveIsDay);
    }, [effectiveIcon, effectiveIsDay]);

    // Quando o clima efetivo mudar, faz fade-in das partículas
    useEffect(() => {
        const changed =
            prevParticlesKeyRef.current.icon !== effectiveIcon ||
            prevParticlesKeyRef.current.isDay !== effectiveIsDay;
        if (changed) {
            setParticlesOpacity(0);
            const id = requestAnimationFrame(() => setParticlesOpacity(1));
            prevParticlesKeyRef.current = { icon: effectiveIcon, isDay: effectiveIsDay };
            return () => cancelAnimationFrame(id);
        }
    }, [effectiveIcon, effectiveIsDay]);

    return (
        <div
            className="min-h-screen transition-all duration-[2000ms] ease-in-out relative overflow-hidden"
            style={backgroundStyle}
        >
            {/* Overlay com fundo anterior para crossfade suave */}
            {showOverlay && prevBgRef.current && (
                <div
                    className="absolute inset-0 pointer-events-none z-[1]"
                    style={{
                        background: getGradientStyle(prevBgRef.current.isDay, prevBgRef.current.icon),
                        opacity: overlayOpacity,
                        transition: `opacity ${FADE_MS}ms ease`,
                        willChange: 'opacity',
                    }}
                    aria-hidden="true"
                />
            )}
            <div
                className="absolute inset-0 overflow-hidden pointer-events-none z-0"
                aria-hidden="true"
                style={{ opacity: particlesOpacity, transition: 'opacity 1200ms ease' }}
            >
                {/* Partículas de fundo genéricas */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl gentle-pulse" />
                <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full blur-lg gentle-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-32 left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl gentle-pulse" style={{ animationDelay: '2s' }} />

                {/* Partículas específicas do clima */}
                {animatedElements.map((element) => (
                    <AnimatedParticle key={`${effectiveIcon ?? 'none'}-${element.id}`} className={element.className} style={element.style} />
                ))}
            </div>
            <div className="relative z-10">{children}</div>
        </div>
    );
}