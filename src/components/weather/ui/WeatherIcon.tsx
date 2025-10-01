import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, Zap, Eye, Moon } from 'lucide-react';

interface WeatherIconProps {
  condition: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

/**
 * Componente WeatherIcon reutilizável para ícones de condições climáticas
 * @param condition - Condição climática (sunny, cloudy, rainy, etc.)
 * @param size - Tamanho do ícone (sm, md, lg, xl)
 * @param animated - Se deve ter animação
 */
export default function WeatherIcon({
  condition,
  size = 'md',
  animated = true,
  className = ''
}: WeatherIconProps) {
  const weatherIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    sunny: Sun,
    cloudy: Cloud,
    'partly-cloudy': Cloud,
    rainy: CloudRain,
    stormy: Zap,
    snowy: CloudSnow,
    foggy: Eye,
    'clear-night': Moon,
  };

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-24 h-24 md:w-32 md:h-32',
    xl: 'w-32 h-32 md:w-40 md:h-40'
  };

  const IconComponent = weatherIcons[condition] || Sun;
  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <IconComponent
      className={`${sizes[size]} ${animationClass} text-white ${className}`}
      aria-hidden="true"
    />
  );
}