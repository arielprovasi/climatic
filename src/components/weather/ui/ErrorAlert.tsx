import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  type?: 'error' | 'success' | 'info' | 'warning';
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
  className?: string;
}

/**
 * Componente ErrorAlert reutilizável para notificações
 * @param message - Mensagem a ser exibida
 * @param type - Tipo do alerta (error, success, info, warning)
 * @param onClose - Função para fechar o alerta
 * @param autoClose - Se deve fechar automaticamente
 * @param duration - Duração em ms antes de fechar automaticamente
 */
export default function ErrorAlert({
  message,
  type = 'error',
  onClose,
  autoClose = false,
  duration = 5000,
  className = ''
}: ErrorAlertProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // Tempo para animação de fade
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const typeStyles = {
    error: {
      bg: 'bg-red-500/90',
      icon: AlertCircle,
      iconColor: 'text-red-100'
    },
    success: {
      bg: 'bg-green-500/90',
      icon: CheckCircle,
      iconColor: 'text-green-100'
    },
    info: {
      bg: 'bg-blue-500/90',
      icon: Info,
      iconColor: 'text-blue-100'
    },
    warning: {
      bg: 'bg-yellow-500/90',
      icon: AlertCircle,
      iconColor: 'text-yellow-100'
    }
  };

  const currentType = typeStyles[type];
  const IconComponent = currentType.icon;

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${className}`}
    >
      <div className={`${currentType.bg} backdrop-blur-sm rounded-lg shadow-lg p-4 text-white`}>
        <div className="flex items-start gap-3">
          <IconComponent className={`w-5 h-5 mt-0.5 ${currentType.iconColor} flex-shrink-0`} />
          <div className="flex-1">
            <p className="text-sm font-medium leading-5">{message}</p>
          </div>
          {onClose && (
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1 hover:bg-white/20 rounded-md transition-colors"
              aria-label="Fechar alerta"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}