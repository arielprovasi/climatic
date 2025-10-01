import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'primary' | 'secondary';
  className?: string;
}

/**
 * Componente Spinner reutilizável para estados de carregamento
 * @param size - Tamanho do spinner (sm, md, lg)
 * @param color - Cor do spinner (white, primary, secondary)
 */
export default function Spinner({
  size = 'md',
  color = 'white',
  className = ''
}: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  };
  
  const colors = {
    white: 'border-white/30 border-t-white',
    primary: 'border-blue-200 border-t-blue-500',
    secondary: 'border-gray-200 border-t-gray-500'
  };

  return (
    <div
      className={`${sizes[size]} ${colors[color]} rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Carregando"
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
}