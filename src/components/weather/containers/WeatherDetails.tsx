import React from 'react';
import { Wind, Droplets, Thermometer } from 'lucide-react';
import type { WeatherData } from '@/services/WeatherService';

type Props = {
    weatherData: WeatherData;
};

export default function WeatherDetails({ weatherData }: Props) {
    const details = [
        {
            icon: Wind,
            label: 'Vento',
            value: `${weatherData.windSpeed} km/h`,
            color: 'text-blue-300',
        },
        {
            icon: Droplets,
            label: 'Umidade',
            value: `${weatherData.humidity}%`,
            color: 'text-cyan-300',
        },
        {
            icon: Thermometer,
            label: 'Sensação',
            value: `${Math.round(weatherData.feelsLike)}°C`,
            color: 'text-orange-300',
        },
    ];

    return (
        <div className="max-w-3xl mx-auto text-white">
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-6">
                {details.map((detail) => (
                    <div
                        key={detail.label}
                        className="flex w-full sm:w-auto items-center gap-2 px-3 py-2 rounded-full bg-white/20 backdrop-blur-sm justify-start text-left shadow-2xl"
                    >
                        <detail.icon
                            className={`w-4 h-4 ${detail.color}`}
                            aria-hidden="true"
                        />
                        <span className="text-white/80 text-xs font-medium">
                            {detail.label}
                        </span>
                        <span className="text-white text-sm font-semibold">
                            {detail.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
