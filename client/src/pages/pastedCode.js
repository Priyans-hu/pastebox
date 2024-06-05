import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import PasteApiInstance from '../api/pasteApi';

const PastedCode = ({ id }) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pasteLink, setPasteLink] = useState('');

    useEffect(() => {
        const fetchCode = async () => {
            try {
                setPasteLink(id);
                const response = await PasteApiInstance.getPasteById(id);
                setCode(response.data.content);
                setLoading(false);
            } catch (error) {
                setError('An error occurred while fetching the code.');
                setLoading(false);
            }
        };

        fetchCode();
    }, [id]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        alert('Copied to clipboard');
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white">
            <header className="p-8 w-2/3 flex justify-between">
                <a href="/">
                    <h1 className="text-3xl font-bold" style={{ fontFamily: "'Roboto Slab', serif" }}>
                        Pastebox
                    </h1>
                </a>
                {pasteLink && (
                    <p className="mt-2">
                        <a href={pasteLink} className="text-blue-400 hover:underline">
                            {window.location.origin}/{pasteLink}
                        </a>
                    </p>
                )}
            </header>
            <div className="pasted-code w-2/3 p-8 relative">
                <div className='flex justify-between items-center'>
                    <h1 className='text-xl font-bold'>Pasted Code</h1>
                    <button className="copy-btn m-2 p-2 bg-gray-800 rounded-lg text-white" onClick={handleCopy}>
                        <i class="fa-solid fa-copy"></i>
                    </button>
                </div>
                <SyntaxHighlighter language="javascript" style={darcula}>
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}

export default PastedCode;