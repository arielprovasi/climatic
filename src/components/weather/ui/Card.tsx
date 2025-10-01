import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'glass' | 'solid' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Componente Card reutilizável com efeito glassmorphism
 * @param variant - Estilo do card (glass, solid, outline)
 * @param padding - Espaçamento interno (none, sm, md, lg)
 * @param children - Conteúdo do card
 */
export default function Card({
  children,
  variant = 'glass',
  padding = 'md',
  className = ''
}: CardProps) {
  const baseStyles = 'rounded-2xl shadow-2xl transition-all duration-200';
  
  const variants = {
    glass: 'bg-white/20 backdrop-blur-sm',
    solid: 'bg-white/10 backdrop-blur-md',
    outline: 'border border-white/20 backdrop-blur-sm'
  };
  
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}