'use client';

import { UI_CONFIG } from '@/lib/constants';
import type { WeatherData } from '@/services/WeatherService';

/**
 * Hook customizado para determinar se é dia ou noite com base nos dados do clima.
 * @param weatherData - Os dados do clima, que podem incluir horários de nascer e pôr do sol.
 * @returns Um objeto contendo a função `isDayTime`.
 */
export function useTime(weatherData: WeatherData | null) {
    /**
     * Verifica se é dia. Se os dados de nascer/pôr do sol estiverem disponíveis,
     * usa-os para uma verificação precisa. Caso contrário, usa um fallback
     * baseado no horário (6h às 18h).
     * @returns `true` se for dia, `false` caso contrário.
     */
    const isDayTime = (): boolean => {
        const currentTime = new Date();

        if (!weatherData?.sunrise || !weatherData?.sunset) {
            // Fallback se não houver dados de nascer/pôr do sol
            const hour = currentTime.getHours();
            return hour >= UI_CONFIG.DAY_START_HOUR && hour < UI_CONFIG.DAY_END_HOUR;
        }

        // Usa os dados precisos da API
        const nowInSeconds = currentTime.getTime() / 1000;
        return nowInSeconds > weatherData.sunrise && nowInSeconds < weatherData.sunset;
    };

    return { isDayTime };
}