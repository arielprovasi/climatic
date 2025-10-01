import { NextRequest, NextResponse } from 'next/server';
import { WeatherService } from '@/services/WeatherService';

// Rota de API: retorna o clima atual por cidade ou coordenadas
// Valida query params e converte erros internos em mensagens amigáveis

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!city && !(lat && lon)) {
        return NextResponse.json(
            { message: 'Parâmetros de cidade ou geolocalização são obrigatórios' },
            { status: 400 }
        );
    }

    try {
        const weatherService = new WeatherService();
        const weatherData = await weatherService.getCurrentWeather({ city, lat, lon });
        return NextResponse.json(weatherData);
    } catch (err) {
        const error = err as Error;

        // Cidade não encontrada
        if (error.message.includes('City not found')) {
            return NextResponse.json({ message: 'Cidade não encontrada' }, { status: 404 });
        }

        // Falta de API key ou configuração incorreta
        if (error.message.includes('Server config error')) {
            // Log do erro no servidor para depuração
            console.error('Server configuration error:', error.message);
            return NextResponse.json(
                { message: 'Erro de configuração no servidor' },
                { status: 500 }
            );
        }

        // Fallback genérico para erros externos e falhas de rede
        console.error('API Error:', error.message);
        return NextResponse.json(
            { message: 'Não foi possível obter os dados do clima' },
            { status: 500 }
        );
    }
}