import { API_CONFIG, ERROR_MESSAGES } from '@/lib/constants';

/**
 * Tipagem padronizada dos dados de clima consumidos pela UI.
 * Mantém a aplicação desacoplada do formato bruto da OpenWeather.
 */
export interface WeatherData {
    city: string;
    country: string;
    temperature: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
    feelsLike: number;
    weatherIcon: WeatherIcon;
    sunrise: number;
    sunset: number;
}

interface OpenWeatherResponse {
    wind?: {
        speed?: number;
    };
    weather?: {
        main?: string;
        icon?: string;
        description?: string;
    }[];
    name?: string;
    sys?: {
        country?: string;
        sunrise?: number;
        sunset?: number;
    };
    main?: {
        temp?: number;
        humidity?: number;
        feels_like?: number;
    };
}


export type WeatherIcon =
    | 'sunny'
    | 'cloudy'
    | 'rainy'
    | 'stormy'
    | 'snowy'
    | 'foggy'
    | 'partly-cloudy'
    | 'clear-night';

// Mapa centralizado: condição (OpenWeather) -> ícone e tradução PT-BR
const conditionMap: Record<string, { icon: WeatherIcon; pt: string }> = {
    thunderstorm: { icon: 'stormy', pt: 'Tempestade' },
    drizzle: { icon: 'rainy', pt: 'Garoa' },
    rain: { icon: 'rainy', pt: 'Chuva' },
    snow: { icon: 'snowy', pt: 'Neve' },
    mist: { icon: 'foggy', pt: 'Neblina' },
    smoke: { icon: 'foggy', pt: 'Fumaça' },
    haze: { icon: 'foggy', pt: 'Névoa' },
    dust: { icon: 'foggy', pt: 'Poeira' },
    fog: { icon: 'foggy', pt: 'Nevoeiro' },
    sand: { icon: 'foggy', pt: 'Areia' },
    ash: { icon: 'foggy', pt: 'Cinzas' },
    squall: { icon: 'stormy', pt: 'Rajadas' },
    tornado: { icon: 'stormy', pt: 'Tornado' },
};

/**
 * Converte a condição principal e o código de ícone da OpenWeather
 * em um ícone próprio da aplicação e uma descrição em PT-BR.
 */
function mapWeatherCondition(
    main: string,
    iconCode?: string
): { icon: WeatherIcon; pt: string } {
    const normalizedMain = main.toLowerCase();

    if (conditionMap[normalizedMain]) {
        return conditionMap[normalizedMain];
    }

    if (normalizedMain.includes('clouds')) {
        if (iconCode && (iconCode.startsWith('03') || iconCode.startsWith('04'))) {
            return { icon: 'cloudy', pt: 'Nublado' };
        }
        return { icon: 'partly-cloudy', pt: 'Parcialmente Nublado' };
    }

    if (normalizedMain.includes('clear')) {
        return iconCode?.endsWith('n')
            ? { icon: 'clear-night', pt: 'Céu Limpo' }
            : { icon: 'sunny', pt: 'Ensolarado' };
    }

    // Fallback para condições não mapeadas
    return { icon: 'sunny', pt: sentenceCase(main) };
}

/** Capitaliza somente a primeira letra e normaliza o restante. */
function sentenceCase(text: string): string {
    if (!text) return text;
    const trimmed = text.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

interface OpenWeatherCity {
    name: string;
    country: string;
    state?: string;
    lat: number;
    lon: number;
}

export class WeatherService {
    private apiKey: string;

    constructor() {
        this.apiKey = process.env.OPENWEATHER_API_KEY || '';
        if (!this.apiKey) {
            // Em um app real, isso poderia logar para um serviço de monitoramento
            throw new Error(ERROR_MESSAGES.API_KEY_MISSING);
        }
    }

    public async getCurrentWeather(location: {
        city?: string | null;
        lat?: string | null;
        lon?: string | null;
    }): Promise<WeatherData> {
        const { city, lat, lon } = location;
        if (!city && !(lat && lon)) {
            throw new Error(ERROR_MESSAGES.CITY_NOT_FOUND);
        }

        const url = city
            ? `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
                  city
              )}&appid=${this.apiKey}&units=metric&lang=pt_br`
            : `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(
                  lat as string
              )}&lon=${encodeURIComponent(lon as string)}&appid=${
                  this.apiKey
              }&units=metric&lang=pt_br`;

        // Revalidação (ISR): evita chamadas excessivas à API em produção
        const res = await fetch(url, { next: { revalidate: API_CONFIG.WEATHER_CACHE_TIME } }); // Revalida usando constante

        if (!res.ok) {
            if (res.status === 404) {
                throw new Error(ERROR_MESSAGES.CITY_NOT_FOUND);
            }
            if (res.status === 429) {
                throw new Error('Muitas requisições. Tente novamente em alguns minutos.');
            }
            const errorBody = await res.json().catch(() => ({ message: res.statusText }));
            throw new Error(
                `Failed to fetch weather: ${errorBody.message || ERROR_MESSAGES.GENERIC_API_ERROR}`
            );
        }

        const data = (await res.json()) as OpenWeatherResponse;
        return this.transformResponse(data);
    }

    /**
     * Traduz o payload bruto da OpenWeather para o contrato WeatherData.
     * Responsável por cálculos (ex.: wind m/s -> km/h) e fallbacks.
     */
    private transformResponse(data: OpenWeatherResponse): WeatherData {
        const windMs = data.wind?.speed ?? 0;
        const windKmH = Math.round(windMs * 3.6);

        const weatherMain = data.weather?.[0]?.main ?? 'Clear';
        const weatherIconCode = data.weather?.[0]?.icon;
        const { icon: mappedIcon, pt: mappedCondition } = mapWeatherCondition(
            weatherMain,
            weatherIconCode
        );

        return {
            city: data.name ?? 'Desconhecida',
            country: data.sys?.country ?? '',
            temperature: Math.round(data.main?.temp ?? 0),
            condition: mappedCondition,
            description: sentenceCase(data.weather?.[0]?.description ?? ''),
            humidity: data.main?.humidity ?? 0,
            windSpeed: windKmH,
            feelsLike: Math.round(data.main?.feels_like ?? 0),
            weatherIcon: mappedIcon,
            sunrise: data.sys?.sunrise ?? 0,
            sunset: data.sys?.sunset ?? 0,
        };
    }

    /**
     * Busca cidades para autocomplete usando o endpoint de geocoding.
     * Retorna no máximo MAX_CITY_SUGGESTIONS (config).
     */
    public async findCities(query: string): Promise<OpenWeatherCity[]> {
        if (!query) {
            return [];
        }

        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
            query
        )}&limit=${API_CONFIG.MAX_CITY_SUGGESTIONS}&appid=${this.apiKey}`;

        const res = await fetch(url);

        if (!res.ok) {
            const errorBody = await res.json().catch(() => ({ message: res.statusText }));
            throw new Error(
                `Failed to fetch cities: ${errorBody.message || 'Unknown API error'}`
            );
        }

        const data = (await res.json()) as OpenWeatherCity[];
        return data.map((city) => ({
            name: city.name,
            country: city.country,
            state: city.state,
            lat: city.lat,
            lon: city.lon,
        }));
    }
}
