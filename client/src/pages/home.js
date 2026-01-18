import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import pasteApi from '../api/pasteApi';
import { LANGUAGES } from '../constants/languages';

const EXPIRATION_OPTIONS = [
    { value: '1h', label: '1 Hour' },
    { value: '1d', label: '1 Day' },
    { value: '1w', label: '1 Week' },
    { value: 'custom', label: 'Custom' }
];

function Home() {
    const navigate = useNavigate();
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [language, setLanguage] = useState('plaintext');
    const [expiresIn, setExpiresIn] = useState('1w');
    const [customValue, setCustomValue] = useState('');
    const [customUnit, setCustomUnit] = useState('hours');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getExpirationValue = () => {
        if (expiresIn !== 'custom') return expiresIn;
        const val = parseInt(customValue, 10);
        if (isNaN(val) || val <= 0) return '1w';
        if (customUnit === 'hours') {
            return `${Math.min(val, 24)}h`;
        }
        return `${Math.min(val, 7)}d`;
    };

    const validateCustomInput = (value, unit) => {
        const num = parseInt(value, 10);
        if (isNaN(num) || num <= 0) return '';
        if (unit === 'hours') return String(Math.min(num, 24));
        return String(Math.min(num, 7));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await pasteApi.createPaste({
                content,
                language,
                title: title.trim() || 'Untitled',
                expiresIn: getExpirationValue()
            });
            navigate(`/${response.data._id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create paste. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#282a36]">
            {/* Header */}
            <header className="border-b border-gray-700">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Roboto Slab', serif" }}>
                        <i className="fas fa-clipboard mr-2 text-purple-400"></i>
                        PasteBox
                    </h1>
                    <span className="text-gray-400 text-sm">Share code snippets easily</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title Input */}
                    <div className="w-full">
                        <input
                            type="text"
                            placeholder="Paste title (optional)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-[#44475a] text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors placeholder-gray-400"
                            maxLength={100}
                        />
                    </div>

                    {/* Language and Expiration Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="block text-gray-400 text-xs mb-1 ml-1">Language</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full bg-[#44475a] text-white px-4 py-2.5 rounded-lg border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors cursor-pointer appearance-none"
                            >
                                {LANGUAGES.map((lang) => (
                                    <option key={lang.value} value={lang.value}>
                                        {lang.label}
                                    </option>
                                ))}
                            </select>
                            <i className="fas fa-chevron-down absolute right-3 top-9 text-gray-400 pointer-events-none text-xs"></i>
                        </div>
                        <div className="relative">
                            <label className="block text-gray-400 text-xs mb-1 ml-1">Expires In</label>
                            <select
                                value={expiresIn}
                                onChange={(e) => setExpiresIn(e.target.value)}
                                className="w-full bg-[#44475a] text-white px-4 py-2.5 rounded-lg border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors cursor-pointer appearance-none"
                            >
                                {EXPIRATION_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <i className="fas fa-chevron-down absolute right-3 top-9 text-gray-400 pointer-events-none text-xs"></i>
                        </div>
                    </div>

                    {/* Custom Expiration Input */}
                    {expiresIn === 'custom' && (
                        <div className="bg-[#1e1f29] rounded-lg p-4 border border-gray-700">
                            <label className="block text-gray-400 text-xs mb-2">Custom Expiration</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    min="1"
                                    max={customUnit === 'hours' ? 24 : 7}
                                    placeholder={customUnit === 'hours' ? '1-24' : '1-7'}
                                    value={customValue}
                                    onChange={(e) => setCustomValue(validateCustomInput(e.target.value, customUnit))}
                                    className="w-20 bg-[#44475a] text-white text-center px-3 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                />
                                <div className="flex rounded-lg overflow-hidden border border-gray-600">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCustomUnit('hours');
                                            setCustomValue(validateCustomInput(customValue, 'hours'));
                                        }}
                                        className={`px-4 py-2 text-sm transition-colors ${
                                            customUnit === 'hours'
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-[#44475a] text-gray-300 hover:bg-[#555770]'
                                        }`}
                                    >
                                        Hours
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCustomUnit('days');
                                            setCustomValue(validateCustomInput(customValue, 'days'));
                                        }}
                                        className={`px-4 py-2 text-sm transition-colors ${
                                            customUnit === 'days'
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-[#44475a] text-gray-300 hover:bg-[#555770]'
                                        }`}
                                    >
                                        Days
                                    </button>
                                </div>
                                <span className="text-gray-500 text-sm">
                                    (max {customUnit === 'hours' ? '24 hours' : '7 days'})
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Code Editor */}
                    <div className="relative">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Paste your code here..."
                            className="w-full h-[60vh] bg-[#282a36] text-[#f8f8f2] p-4 rounded-lg border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors resize-none font-mono text-sm"
                            style={{ fontFamily: '"Fira Code", "Fira Mono", monospace' }}
                            spellCheck={false}
                        />
                        <div className="absolute bottom-3 right-3 text-gray-500 text-sm">
                            {content.length} characters | {content.split('\n').length} lines
                        </div>
                    </div>

                    {/* Preview (if content exists) */}
                    {content.trim() && (
                        <div className="border border-gray-600 rounded-lg overflow-hidden">
                            <div className="bg-[#44475a] px-4 py-2 text-sm text-gray-300 flex items-center justify-between">
                                <span>
                                    <i className="fas fa-eye mr-2"></i>Preview
                                </span>
                                <span className="text-purple-400">{LANGUAGES.find(l => l.value === language)?.label}</span>
                            </div>
                            <div className="max-h-[200px] overflow-auto">
                                <SyntaxHighlighter
                                    language={language}
                                    style={dracula}
                                    showLineNumbers
                                    customStyle={{ margin: 0, borderRadius: 0 }}
                                >
                                    {content}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!content.trim() || loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Creating paste...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-paper-plane"></i>
                                Create Paste
                            </>
                        )}
                    </button>
                </form>

                {/* Info */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>
                        <i className="fas fa-clock mr-1"></i>
                        {expiresIn === 'custom'
                            ? customValue
                                ? `Paste will expire after ${customValue} ${customUnit}`
                                : 'Enter custom expiration time'
                            : `Paste will expire after ${EXPIRATION_OPTIONS.find(o => o.value === expiresIn)?.label.toLowerCase()}`
                        }
                    </p>
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
}

export default Home;
