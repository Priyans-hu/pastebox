/**
 * PasteBox Server Type Definitions
 * These types define the shape of data structures used throughout the API
 */

/**
 * Expiration duration format
 * Supports: 1-24h (hours), 1-7d (days), 1w (week)
 * Examples: '1h', '12h', '24h', '1d', '3d', '7d', '1w'
 */
export type ExpirationOption = `${number}h` | `${number}d` | '1w';

/**
 * Paste document as stored in MongoDB
 */
export interface IPaste {
    _id: string;
    title: string;
    content: string;
    language: string;
    expiresIn: ExpirationOption;
    views: number;
    createdAt: Date;
    expiresAt: Date | null;
}

/**
 * Request body for creating a new paste
 */
export interface CreatePasteRequest {
    content: string;
    language?: string;
    title?: string;
    expiresIn?: ExpirationOption;
}

/**
 * Response for a single paste
 */
export interface PasteResponse {
    id: string;
    title: string;
    content: string;
    language: string;
    expiresIn: ExpirationOption;
    views: number;
    createdAt: string;
    expiresAt: string | null;
}

/**
 * Response for paste search results
 */
export interface PasteSearchResult {
    _id: string;
    title: string;
    language: string;
    views: number;
    createdAt: string;
    expiresAt: string | null;
}

/**
 * Paste analytics response
 */
export interface PasteAnalytics {
    id: string;
    title: string;
    views: number;
    createdAt: string;
    expiresAt: string | null;
    expiresIn: ExpirationOption;
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
