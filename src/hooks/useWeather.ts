'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ERROR_MESSAGES, STORAGE_KEYS } from '@/lib/constants';
import type { WeatherData } from '@/services/WeatherService';

/**
 * Hook principal de clima:
 * - Coordena busca por cidade ou geolocalização
 * - Gerencia estados de loading/erro
 * - Persiste a última cidade no localStorage
 */
export function useWeather() {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [isLoadingInitialData, setIsLoadingInitialData] = useState<boolean>(true);
    const [isFetchingWeather, setIsFetchingWeather] = useState<boolean>(false);
    const [currentCity, setCurrentCity] = useState<string>('');
    const [error, setError] = useState<string>('');
    const activeControllerRef = useRef<AbortController | null>(null);

    /**
     * Solicita dados do clima via API interna (/api/weather).
     * Cancela requisições em voo usando AbortController para evitar corrida.
     */
    const fetchWeather = useCallback(
        async (search: { city?: string; lat?: number; lon?: number }) => {
            // Se já houver uma busca em andamento, cancela
            if (activeControllerRef.current) {
                activeControllerRef.current.abort();
            }
            const controller = new AbortController();
            activeControllerRef.current = controller;

            setIsFetchingWeather(true);
            setError('');

            let url = '/api/weather';
            if (search.lat && search.lon) {
                url += `?lat=${search.lat}&lon=${search.lon}`;
            } else if (search.city) {
                url += `?city=${encodeURIComponent(search.city)}`;
            } else {
                setIsFetchingWeather(false);
                return; // Nada para buscar
            }

            try {
                const res = await fetch(url, { signal: controller.signal });
                const data = await res.json();

                if (!res.ok) {
                    // Usa a mensagem da API ou um fallback
                    throw new Error(data.message || 'Não foi possível obter o clima.');
                }

                setWeatherData(data as WeatherData);
                const displayCity = `${data.city}, ${data.country}`;
                setCurrentCity(displayCity);

                // Tenta persistir a última cidade usada (opcional em ambientes restritos)
                try {
                    localStorage.setItem(STORAGE_KEYS.LAST_CITY, displayCity);
                } catch (e) {
                    console.warn('Falha ao salvar a última cidade no localStorage:', e);
                }
            } catch (err) {
                if (err instanceof Error && err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                // Evita sobrescrever estados se a requisição foi abortada
                if (!controller.signal.aborted) {
                    setIsFetchingWeather(false);
                    setIsLoadingInitialData(false);
                }
            }
        },
        []
    );

    const handleGeolocationError = useCallback((err: GeolocationPositionError) => {
        switch (err.code) {
            case err.PERMISSION_DENIED:
                setError(ERROR_MESSAGES.GEOLOCATION_DENIED);
                break;
            case err.POSITION_UNAVAILABLE:
                setError(ERROR_MESSAGES.GEOLOCATION_UNAVAILABLE);
                break;
            case err.TIMEOUT:
                setError(ERROR_MESSAGES.GEOLOCATION_TIMEOUT);
                break;
            default:
                setError('Não foi possível obter sua localização.');
                break;
        }
        // Após o erro de geolocalização, carrega a cidade fallback
        const fallbackCity = localStorage.getItem(STORAGE_KEYS.LAST_CITY) || 'São Paulo, Brazil';
        fetchWeather({ city: fallbackCity });
    }, [fetchWeather]);

    const handleLocationClick = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    fetchWeather({
                        lat: pos.coords.latitude,
                        lon: pos.coords.longitude,
                    });
                },
                handleGeolocationError,
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            setError('Geolocalização não é suportada neste navegador.');
            const fallbackCity = localStorage.getItem(STORAGE_KEYS.LAST_CITY) || 'São Paulo, Brazil';
            fetchWeather({ city: fallbackCity });
        }
    }, [fetchWeather, handleGeolocationError]);

    // Efeito de bootstrap: tenta geolocalização ao montar
    useEffect(() => {
        // Tenta obter a localização do usuário primeiro
        handleLocationClick();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Executa apenas uma vez

    return {
        weatherData,
        isLoadingInitialData,
        isFetchingWeather,
        currentCity,
        error,
        setError,
        fetchWeather,
        handleLocationClick,
    };
}