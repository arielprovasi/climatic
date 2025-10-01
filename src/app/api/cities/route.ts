import { WeatherService } from '@/services/WeatherService';
import { NextRequest, NextResponse } from 'next/server';

// Rota de API: sugere cidades para autocomplete com base em 'q'
// Defende contra reqs vazias e traduz erros internos

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json(
            { message: "O parâmetro de busca 'q' é obrigatório" },
            { status: 400 }
        );
    }

    try {
        const weatherService = new WeatherService();
        const cities = await weatherService.findCities(query);
        return NextResponse.json(cities);
    } catch (err) {
        const error = err as Error;

        // Falta de configuração no servidor (API key, etc.)
        if (error.message.includes('Server config error')) {
            console.error('Server configuration error:', error.message);
            return NextResponse.json(
                { message: 'Erro de configuração no servidor' },
                { status: 500 }
            );
        }

        // Fallback genérico: falha ao buscar cidades
        console.error('API Error fetching cities:', error.message);
        return NextResponse.json(
            { message: 'Não foi possível buscar as cidades' },
            { status: 500 }
        );
    }
}