'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { API_CONFIG } from '@/lib/constants';
import { SearchBar } from '../search/SearchBar';
import { SuggestionsList } from '../search/SuggestionsList';
import { ErrorDisplay } from '../search/ErrorDisplay';
import StaticHeaderContent from '../layout/StaticHeaderContent';
import type { CitySuggestion } from '@/types/weather';

type Props = {
    onSearch: (search: { city?: string; lat?: number; lon?: number }) => void;
    onLocationClick?: () => void;
    error: string;
    onClearError: () => void;
};

export default function WeatherHeader({ onSearch, onLocationClick, error, onClearError }: Props) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
    const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
    const debouncedQuery = useDebounce(query, API_CONFIG.DEBOUNCE_DELAY);
    const containerRef = useRef<HTMLDivElement>(null);

    // Efeito para buscar sugestões de cidades com base na query digitada
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedQuery.length < API_CONFIG.CITY_SEARCH_MIN_LENGTH) {
                setSuggestions([]);
                setIsFetchingSuggestions(false);
                return;
            }

            setIsFetchingSuggestions(true);
            try {
                const response = await fetch(`/api/cities?q=${debouncedQuery}`);
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setSuggestions(data);
            } catch (err) {
                console.error('Failed to fetch city suggestions:', err);
                setSuggestions([]); // Limpa sugestões em caso de erro
            } finally {
                setIsFetchingSuggestions(false);
            }
        };

        fetchSuggestions();
    }, [debouncedQuery]);

    // Efeito para fechar a lista de sugestões ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsSuggestionsVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSuggestionClick = (suggestion: CitySuggestion) => {
        onSearch({ lat: suggestion.lat, lon: suggestion.lon });
        cleanupAfterSearch();
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch({ city: query.trim() });
            cleanupAfterSearch();
        }
    };

    const cleanupAfterSearch = () => {
        setQuery('');
        setSuggestions([]);
        setIsSuggestionsVisible(false);
    };

    return (
        <header className="text-center mt-4 mb-4">
            <StaticHeaderContent />

            <div className="relative w-full max-w-md mx-auto" ref={containerRef}>
                <SearchBar
                    query={query}
                    onQueryChange={setQuery}
                    onFocus={() => setIsSuggestionsVisible(true)}
                    isSearching={isFetchingSuggestions}
                    onLocationClick={onLocationClick}
                    onSubmit={handleFormSubmit}
                />

                {isSuggestionsVisible && (
                    <SuggestionsList
                        suggestions={suggestions}
                        onSuggestionClick={handleSuggestionClick}
                    />
                )}

                <ErrorDisplay error={error} onClearError={onClearError} />
            </div>
        </header>
    );
}
