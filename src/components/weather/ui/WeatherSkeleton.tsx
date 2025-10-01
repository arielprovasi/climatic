/**
 * WeatherSkeleton Component
 *
 * Exibe uma interface de esqueleto de carregamento para simular a aparência
 * dos dados do clima enquanto eles estão sendo buscados.
 */
export function WeatherSkeleton() {
    return (
        <div
            className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8"
            aria-label="Carregando dados do clima"
            role="status"
        >
            {/* Esqueleto para o Nome da Cidade */}
            <div className="h-10 w-60 bg-white/20 rounded-xl animate-pulse" />

            <div className="flex flex-col items-center gap-6">
                {/* Esqueleto para o Ícone do Clima Principal */}
                <div className="w-36 h-36 bg-white/15 rounded-3xl animate-pulse shadow-2xl" />
                <div className="flex items-end gap-4">
                    {/* Esqueleto para a Temperatura */}
                    <div className="h-20 w-28 bg-white/20 rounded-md animate-pulse shadow-2xl" />
                    <div className="space-y-2">
                        {/* Esqueleto para a Condição do Clima */}
                        <div className="h-6 w-40 bg-white/20 rounded-md animate-pulse shadow-2xl" />
                        {/* Esqueleto para a Descrição do Clima */}
                        <div className="h-4 w-52 bg-white/15 rounded-md animate-pulse shadow-2xl" />
                    </div>
                </div>
            </div>

            {/* Esqueleto para os Detalhes do Clima */}
            <div className="flex flex-wrap justify-center gap-4">
                <div className="h-8 w-32 bg-white/15 rounded-full animate-pulse shadow-2xl" />
                <div className="h-8 w-32 bg-white/15 rounded-full animate-pulse shadow-2xl" />
                <div className="h-8 w-32 bg-white/15 rounded-full animate-pulse shadow-2xl" />
            </div>
        </div>
    );
}
