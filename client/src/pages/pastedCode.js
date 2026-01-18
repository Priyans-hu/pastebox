import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import pasteApi from '../api/pasteApi';
import { getLanguageLabel } from '../constants/languages';

const PastedCode = ({ id }) => {
    const [paste, setPaste] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    useEffect(() => {
        const fetchPaste = async () => {
            try {
                const response = await pasteApi.getPasteById(id);
                setPaste(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load paste. It may have expired or been deleted.');
            } finally {
                setLoading(false);
            }
        };

        fetchPaste();
    }, [id]);

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(paste.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeUntilExpiry = (expiresAt) => {
        if (!expiresAt) return 'Never expires';

        const now = new Date();
        const expiry = new Date(expiresAt);
        const diff = expiry - now;

        if (diff <= 0) return 'Expired';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `${days}d ${hours}h remaining`;
        if (hours > 0) return `${hours}h remaining`;
        return 'Less than 1 hour remaining';
    };

    const formatViews = (views) => {
        if (!views) return '0 views';
        if (views === 1) return '1 view';
        if (views >= 1000) return `${(views / 1000).toFixed(1)}k views`;
        return `${views} views`;
    };

    const handleViewRaw = () => {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        window.open(`${apiUrl}/api/pastes/${id}/raw`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#282a36]">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl text-purple-400 mb-4"></i>
                    <p className="text-gray-400">Loading paste...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-[#282a36]">
                <header className="border-b border-gray-700">
                    <div className="max-w-6xl mx-auto px-4 py-4">
                        <a href="/" className="text-2xl font-bold text-white hover:text-purple-400 transition-colors" style={{ fontFamily: "'Roboto Slab', serif" }}>
                            <i className="fas fa-clipboard mr-2 text-purple-400"></i>
                            PasteBox
                        </a>
                    </div>
                </header>
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center p-8">
                        <i className="fas fa-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
                        <h2 className="text-2xl font-bold text-white mb-2">Paste Not Found</h2>
                        <p className="text-gray-400 mb-6">{error}</p>
                        <a
                            href="/"
                            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            <i className="fas fa-plus"></i>
                            Create New Paste
                        </a>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#282a36]">
            {/* Header */}
            <header className="border-b border-gray-700">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <a href="/" className="text-2xl font-bold text-white hover:text-purple-400 transition-colors" style={{ fontFamily: "'Roboto Slab', serif" }}>
                        <i className="fas fa-clipboard mr-2 text-purple-400"></i>
                        PasteBox
                    </a>
                    <a
                        href="/"
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                        <i className="fas fa-plus"></i>
                        New Paste
                    </a>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
                {/* Paste Info Bar */}
                <div className="bg-[#44475a] rounded-lg p-4 mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-white mb-1">
                                {paste.title || 'Untitled'}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                    <i className="fas fa-code"></i>
                                    {getLanguageLabel(paste.language)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <i className="fas fa-calendar"></i>
                                    {formatDate(paste.createdAt)}
                                </span>
                                <span className="flex items-center gap-1 text-yellow-400">
                                    <i className="fas fa-clock"></i>
                                    {getTimeUntilExpiry(paste.expiresAt)}
                                </span>
                                <span className="flex items-center gap-1 text-green-400">
                                    <i className="fas fa-eye"></i>
                                    {formatViews(paste.views)}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleViewRaw}
                                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                                title="View raw paste"
                            >
                                <i className="fas fa-file-alt"></i>
                                Raw
                            </button>
                            <button
                                onClick={handleCopyLink}
                                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                            >
                                {linkCopied ? (
                                    <>
                                        <i className="fas fa-check text-green-400"></i>
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-link"></i>
                                        Copy Link
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleCopyCode}
                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                            >
                                {copied ? (
                                    <>
                                        <i className="fas fa-check text-green-400"></i>
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-copy"></i>
                                        Copy Code
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Code Display */}
                <div className="border border-gray-600 rounded-lg overflow-hidden">
                    <div className="bg-[#1e1f29] px-4 py-2 text-sm text-gray-400 flex items-center justify-between border-b border-gray-700">
                        <span>
                            {paste.content.split('\n').length} lines | {paste.content.length} characters
                        </span>
                        <span className="text-purple-400">{getLanguageLabel(paste.language)}</span>
                    </div>
                    <SyntaxHighlighter
                        language={paste.language}
                        style={dracula}
                        showLineNumbers
                        customStyle={{
                            margin: 0,
                            borderRadius: 0,
                            fontSize: '14px',
                            maxHeight: '70vh'
                        }}
                        lineNumberStyle={{ minWidth: '3em', paddingRight: '1em', color: '#6272a4' }}
                    >
                        {paste.content}
                    </SyntaxHighlighter>
                </div>

                {/* Raw View Link */}
                <div className="mt-4 text-center">
                    <span className="text-gray-500 text-sm">
                        Paste ID: <code className="text-purple-400">{id}</code>
                    </span>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-700 py-4">
                <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
                    <a
                        href="https://github.com/Priyans-hu/PasteBox"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-400 transition-colors"
                    >
                        <i className="fab fa-github mr-1"></i>
                        PasteBox
                    </a>
                    {' '}&bull;{' '}
                    Built by Priyanshu
                </div>
            </footer>
        </div>
    );
};

export default PastedCode;
