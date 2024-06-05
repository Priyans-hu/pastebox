import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import { useNavigate } from 'react-router-dom';
import PasteApiInstance from '../api/pasteApi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'dracula-prism/dist/css/dracula-prism.css';

function Home() {
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pasteSuccess, setPasteSuccess] = useState(false);

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        setPasteSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await PasteApiInstance.createPaste(code);
            setPasteSuccess(true);
            navigate(`/${response.data._id}`);
        } catch (error) {
            setError('An error occurred while creating the paste.');
        }

        setLoading(false);
    };

    useEffect(() => {
        const lineCount = code.split('\n').length;
    }, [code]);

    return (
        <div className="min-h-screen flex flex-col items-center bg-dracula text-dracula-fg">
            <header className="p-8 w-2/3 flex justify-between">
                <h1 className="text-3xl font-bold" style={{ fontFamily: "'Roboto Slab', serif" }}>
                    Pastebox
                </h1>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center w-full px-4 py-8">
                <h2 className="text-2xl font-semibold mb-4">
                    <i className="fas fa-paste mr-2"></i>Paste your code
                </h2>
                <form onSubmit={handleSubmit} className="w-3/4">
                    <div className="border border-gray-600 bg-dracula-dark text-dracula-fg rounded-lg mb-4 p-4 overflow-y-auto" style={{ height: '70vh' }}>
                        <Editor
                            value={code}
                            onValueChange={handleCodeChange}
                            highlight={(code) => (
                                <SyntaxHighlighter
                                    language="javascript"
                                    style={dracula}
                                    showLineNumbers
                                    wrapLines
                                    lineProps={{ style: { display: 'block' } }}
                                >
                                    {code}
                                </SyntaxHighlighter>
                            )}
                            padding={10}
                            style={{
                                fontFamily: '"Fira Code", "Fira Mono", monospace',
                                fontSize: 16,
                                backgroundColor: '#282a36',
                                color: '#f8f8f2',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-all',
                                height: '100%',
                                overflowY: 'auto',
                            }}
                            className="editor w-full"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-500 w-full"
                        disabled={!code.trim() || loading}
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin mr-2"></i>Pasting...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-paper-plane mr-2"></i>Paste
                            </>
                        )}
                    </button>
                </form>

                {error && <p className="text-red-500 mt-4">{error}</p>}

                {pasteSuccess && (
                    <div className="mt-8 w-full max-w-6xl">
                        <h2 className="text-xl font-semibold mb-4">
                            <i className="fas fa-check-circle mr-2"></i>Your code snippet
                        </h2>
                        <pre className="bg-gray-900 text-white p-4 rounded-lg">{code}</pre>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Home;