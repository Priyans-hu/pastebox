/**
 * PasteBox Server Type Definitions
 * These types define the shape of data structures used throughout the API
 */

/**
 * Paste document as stored in MongoDB
 */
export interface IPaste {
    _id: string;
    title: string;
    content: string;
    language: string;
    createdAt: Date;
    expiresAt: Date;
}

/**
 * Request body for creating a new paste
 */
export interface CreatePasteRequest {
    content: string;
    language?: string;
    title?: string;
}

/**
 * Response for a single paste
 */
export interface PasteResponse {
    id: string;
    title: string;
    content: string;
    language: string;
    createdAt: string;
    expiresAt: string;
}

/**
 * Response for paste search results
 */
export interface PasteSearchResult {
    _id: string;
    title: string;
    language: string;
    createdAt: string;
    expiresAt: string;
}

/**
 * Health check response
 */
export interface HealthResponse {
    status: 'ok' | 'error';
    timestamp: string;
    cache: {
        enabled: boolean;
        connected: boolean;
    };
}

/**
 * Error response
 */
export interface ErrorResponse {
    error?: string;
    message?: string;
}

/**
 * Cache statistics
 */
export interface CacheStats {
    enabled: boolean;
    connected?: boolean;
    cachedPastes?: number;
    info?: string;
    error?: string;
}

/**
 * Supported programming languages
 */
export type SupportedLanguage =
    | 'plaintext'
    | 'javascript'
    | 'typescript'
    | 'python'
    | 'java'
    | 'c'
    | 'cpp'
    | 'csharp'
    | 'go'
    | 'rust'
    | 'ruby'
    | 'php'
    | 'swift'
    | 'kotlin'
    | 'sql'
    | 'html'
    | 'css'
    | 'scss'
    | 'json'
    | 'yaml'
    | 'xml'
    | 'markdown'
    | 'bash'
    | 'shell'
    | 'dockerfile';

/**
 * Environment variables
 */
export interface EnvConfig {
    PORT: number;
    MONGODB_URI: string;
    REDIS_URL?: string;
    CLIENT_URL?: string;
    NODE_ENV: 'development' | 'production' | 'test';
}
