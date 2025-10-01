'use client';

import type { CitySuggestion } from '@/types/weather';

type Props = {
    suggestions: CitySuggestion[];
    onSuggestionClick: (suggestion: CitySuggestion) => void;
};

export function SuggestionsList({ suggestions, onSuggestionClick }: Props) {
    if (suggestions.length === 0) {
        return null;
    }

    return (
        <ul className="absolute top-full mt-2 w-full bg-white/20 backdrop-blur-sm rounded-xl shadow-2xl z-10 overflow-hidden">
            {suggestions.map((suggestion) => (
                <li
                    key={`${suggestion.lat}-${suggestion.lon}`}
                    // onMouseDown previne que o onBlur do input feche a lista antes do clique
                    onMouseDown={() => onSuggestionClick(suggestion)}
                    className="px-4 py-2 text-left text-white hover:bg-white/30 cursor-pointer transition-colors shadow-2xl"
                >
                    {suggestion.name}
                    {suggestion.state ? `, ${suggestion.state}` : ''}, {suggestion.country}
                </li>
            ))}
        </ul>
    );
}
