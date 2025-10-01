import type { WeatherIcon } from '@/services/WeatherService';

export const getGradientStyle = (isDay: boolean, icon?: WeatherIcon) => {
    if (!icon) {
        return isDay
            ? 'linear-gradient(to bottom, #87CEEB, #6495ED, #4682B4)' // Céu azul claro a médio
            : 'linear-gradient(to bottom, #2c3e50, #34495e, #2c3e50)'; // Noite escura
    }

    switch (icon) {
        case 'sunny':
            return isDay
                ? 'linear-gradient(to top, #FFB74D, #f39c12, #e67e22)' // Sol forte
                : 'linear-gradient(to bottom, #2c3e50, #34495e, #2c3e50)'; // Noite
        case 'cloudy':
            return isDay
                ? 'linear-gradient(to bottom, #90A4AE, #7f8c8d, #95a5a6)' // Nublado dia
                : 'linear-gradient(to bottom, #34495e, #4a6274, #5f7689)'; // Nublado noite
        case 'partly-cloudy':
            return isDay
                ? 'linear-gradient(to bottom, #f39c12, #95a5a6, #3498db)' // Parcialmente nublado dia
                : 'linear-gradient(to bottom, #2c3e50, #4a6274, #5f7689)'; // Parcialmente nublado noite
        case 'rainy':
            return isDay
                ? 'linear-gradient(to bottom, #566573, #808b96, #bdc3c7)' // Chuva dia
                : 'linear-gradient(to bottom, #2c3e50, #34495e, #4a6274)'; // Chuva noite
        case 'stormy':
            return isDay
                ? 'linear-gradient(to bottom, #2c3e50, #515a6b, #f39c12)' // Tempestade dia
                : 'linear-gradient(to bottom, #2c3e50, #1a2533, #0d131a)'; // Tempestade noite
        case 'snowy':
            return isDay
                ? 'linear-gradient(to bottom, #a9cce3, #d4e6f1, #eaf2f8)' // Neve dia
                : 'linear-gradient(to bottom, #34495e, #4a6274, #5f7689)'; // Neve noite
        case 'foggy':
            return isDay
                ? 'linear-gradient(to bottom, #95a5a6, #bdc3c7, #ecf0f1)' // Nevoeiro dia
                : 'linear-gradient(to bottom, #34495e, #4a6274, #5f7689)'; // Nevoeiro noite
        default:
            return isDay
                ? 'linear-gradient(to bottom, #87CEEB, #6495ED, #4682B4)'
                : 'linear-gradient(to bottom, #2c3e50, #34495e, #2c3e50)';
    }
};
