'use client';

import React from 'react';
import {
    WeatherHeader,
    WeatherHero,
    WeatherDetails,
    DynamicBackground,
    WeatherSkeleton,
} from '@/components/weather';
import { useWeather } from '@/hooks/useWeather';
import { useTime } from '@/hooks/useTime';

export default function HomePage() {
    const {
        weatherData,
        isLoadingInitialData,
        currentCity,
        error,
        setError,
        fetchWeather,
        handleLocationClick,
    } = useWeather();

    const { isDayTime } = useTime(weatherData);

    return (
        <DynamicBackground
            weatherIcon={weatherData?.weatherIcon}
            isDayTime={isDayTime()}
        >
            <main className="relative z-10 container mx-auto px-4 pt-3 pb-3 sm:pb-[calc(3rem+env(safe-area-inset-bottom))] min-h-[500px] sm:min-h-screen flex flex-col justify-start sm:justify-center items-center text-center">
                <div className="w-full">
                    <WeatherHeader
                        onSearch={(search) => fetchWeather(search)}
                        onLocationClick={handleLocationClick}
                        error={error}
                        onClearError={() => setError('')}
                    />
                </div>

                <div className="w-full flex-1 flex flex-col items-center justify-center">
                    {isLoadingInitialData ? (
                        <WeatherSkeleton />
                    ) : weatherData ? (
                        <>
                            <WeatherHero
                                weatherData={weatherData}
                                currentCity={currentCity}
                            />
                            <WeatherDetails weatherData={weatherData} />
                        </>
                    ) : null}
                </div>

                <footer className="fixed inset-x-0 bottom-0 z-20 pb-[env(safe-area-inset-bottom)]">
                    <div className="w-full px-3 sm:px-4 py-2 sm:py-3 text-center bg-white/20 backdrop-blur-md border-t border-white/30">
                        <p className="text-sm text-white/80">
                            Dados fornecidos pela{' '}
                            <a
                                href="https://openweathermap.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium hover:text-blue-600 underline hover:no-underline transition-colors"
                            >
                                OpenWeatherMap
                            </a>
                            <span className="hidden sm:inline"> • </span>
                            <span className="block sm:inline">
                                <a
                                    href="https://github.com/arielprovasi/climatic"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium hover:text-blue-600 underline hover:no-underline transition-colors"
                                >
                                    Climatic
                                </a>{' '}
                                {new Date().getFullYear()}
                            </span>
                        </p>
                    </div>
                </footer>
            </main>
        </DynamicBackground>
    );
}