// Componentes principais (containers)
export { default as WeatherHeader } from './containers/WeatherHeader';
export { default as WeatherHero } from './containers/WeatherHero';
export { default as WeatherDetails } from './containers/WeatherDetails';

// Componentes de busca
export { SearchBar } from './search/SearchBar';
export { SuggestionsList } from './search/SuggestionsList';
export { ErrorDisplay } from './search/ErrorDisplay';

// Componentes de layout
export { default as DynamicBackground } from './layout/DynamicBackground';
export { default as StaticHeaderContent } from './layout/StaticHeaderContent';

// Componentes de UI
export { WeatherSkeleton } from './ui/WeatherSkeleton';

// Re-export de tipos
export type { CitySuggestion } from '@/types/weather';