'use client';

import { Search, LocateFixed } from 'lucide-react';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

type Props = {
    query: string;
    onQueryChange: (value: string) => void;
    onFocus: () => void;
    isSearching: boolean;
    onLocationClick?: () => void;
    onSubmit: (e: React.FormEvent) => void;
};

export function SearchBar({
    query,
    onQueryChange,
    onFocus,
    isSearching,
    onLocationClick,
    onSubmit,
}: Props) {
    return (
        <form onSubmit={onSubmit} className="mt-4 flex gap-3">
            <div className="relative flex-1">
                <input
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    onFocus={onFocus}
                    placeholder="Digite uma cidade..."
                    className="w-full h-10 px-3 pr-10 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder:text-white/70 hover:bg-white/30 focus:bg-white/30 focus:border-transparent focus:outline-none transition-all duration-300 shadow-2xl"
                />

                {isSearching && (
                    <div className="absolute right-12 inset-y-0 flex items-center pointer-events-none shadow-2xl">
                        <Spinner size="sm" />
                    </div>
                )}

                <div className="absolute right-3 inset-y-0 flex items-center group shadow-2xl">
                    <button
                        type="button"
                        onClick={onLocationClick}
                        className="text-white/70 hover:text-white transition-colors cursor-pointer"
                        aria-label="Usar localização atual"
                    >
                        <LocateFixed className="w-5 h-5" />
                    </button>
                    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max px-2 py-1 text-xs text-white bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm">
                        Usar localização atual
                    </span>
                </div>
            </div>

            <Button
                type="submit"
                variant="primary"
                size="sm"
                className="px-2 rounded-xl"
                aria-label="Buscar"
            >
                <Search className="w-5 h-5" />
            </Button>
        </form>
    );
}
