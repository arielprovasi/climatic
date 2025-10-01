import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

/**
 * Componente Button reutilizável com glassmorphism styling
 * @param variant - Estilo do botão (primary, secondary, ghost)
 * @param size - Tamanho do botão (sm, md, lg)
 * @param loading - Estado de carregamento
 * @param children - Conteúdo do botão
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm shadow-lg hover:shadow-xl',
    secondary: 'bg-black/20 hover:bg-black/30 text-white backdrop-blur-sm border border-white/20',
    ghost: 'text-white hover:bg-white/10'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
          Carregando...
        </>
      ) : (
        children
      )}
    </button>
  );
}