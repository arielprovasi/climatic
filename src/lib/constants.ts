/** Configurações da aplicação centralizadas */

// Configurações de API e cache
export const API_CONFIG = {
    /** Tempo de cache para dados meteorológicos em segundos (5 minutos) */
    WEATHER_CACHE_TIME: 300,
    
    /** Número mínimo de caracteres para buscar cidades */
    CITY_SEARCH_MIN_LENGTH: 3,
    
    /** Delay do debounce para busca em milissegundos */
    DEBOUNCE_DELAY: 300,
    
    /** Timeout para geolocalização em milissegundos (10 segundos) */
    GEOLOCATION_TIMEOUT: 10000,
    
    /** Máximo de sugestões de cidades retornadas */
    MAX_CITY_SUGGESTIONS: 5,
} as const;

// Mensagens de erro padronizadas
export const ERROR_MESSAGES = {
    CITY_NOT_FOUND: 'Cidade não encontrada',
    NETWORK_ERROR: 'Erro de conexão. Tente novamente.',
    GEOLOCATION_DENIED: 'Você negou o acesso à sua localização.',
    GEOLOCATION_UNAVAILABLE: 'Sua localização não está disponível no momento.',
    GEOLOCATION_TIMEOUT: 'A busca pela sua localização demorou demais.',
    SERVER_CONFIG_ERROR: 'Erro de configuração no servidor',
    API_KEY_MISSING: 'Chave da API não configurada',
    GENERIC_API_ERROR: 'Não foi possível obter os dados do clima',
    CITY_SEARCH_ERROR: 'Não foi possível buscar as cidades',
} as const;

// Configurações de UI
export const UI_CONFIG = {
    /** Hora inicial considerada como "dia" quando não há dados de nascer do sol */
    DAY_START_HOUR: 6,
    
    /** Hora final considerada como "dia" quando não há dados de pôr do sol */
    DAY_END_HOUR: 18,
} as const;

// Chaves do localStorage
export const STORAGE_KEYS = {
    LAST_CITY: 'climatic:lastCity',
} as const;