import React from 'react';
import Card from '../ui/Card';
import WeatherIcon from '../ui/WeatherIcon';
import type { WeatherData } from '@/services/WeatherService';

type Props = {
    weatherData: WeatherData;
    currentCity: string;
};

export default function WeatherHero({ weatherData, currentCity }: Props) {
    return (
        <div className="text-center mt-4 mb-8 text-white">
            <div className="mb-8">
                <Card className="inline-flex">
                    <WeatherIcon
                        condition={weatherData.weatherIcon}
                        size="lg"
                        animated={true}
                    />
                </Card>
            </div>

            <div className="mb-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                    <h2 className="text-6xl md:text-8xl font-light text-white tracking-tighter">
                        {Math.round(weatherData.temperature)}°
                    </h2>
                    <div className="text-left">
                        <p className="text-2xl md:text-3xl text-white/90 font-medium leading-tight">
                            {weatherData.condition}
                        </p>
                        <p className="text-base md:text-lg text-white/70 font-light leading-tight">
                            {weatherData.description}
                        </p>
                    </div>
                </div>
            </div>

            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-2xl shadow-2xl">
                <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-ping"
                    aria-hidden="true"
                ></div>
                <span className="sr-only">Localização atual:</span>
                <p className="text-white/90 text-xl font-medium">{currentCity}</p>
            </div>
        </div>
    );
}
