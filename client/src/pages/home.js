import React, { useState } from 'react';
import axios from 'axios';

function Home() {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pasteSuccess, setPasteSuccess] = useState(false);

    const handleCodeChange = (e) => {
        setCode(e.target.value);
        setPasteSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/paste', { code });
            setPasteSuccess(true);
            setCode(response.data.code);
        } catch (error) {
            setError('An error occurred while creating the paste.');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <h1 className="text-2xl font-semibold mb-4">
                <i className="fas fa-paste mr-2"></i>Paste your code
            </h1>
            <form onSubmit={handleSubmit} className="w-full max-w-2xl">
                <textarea
                    value={code}
                    onChange={handleCodeChange}
                    placeholder="Paste your code here..."
                    rows="10"
                    className="border border-gray-600 bg-gray-800 text-white p-4 w-full mb-4 rounded-lg"
                ></textarea>
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
                <div className="mt-8 w-full max-w-2xl">
                    <h2 className="text-xl font-semibold mb-4">
                        <i className="fas fa-check-circle mr-2"></i>Your code snippet
                    </h2>
                    <pre className="bg-gray-900 text-white p-4 rounded-lg">{code}</pre>
                </div>
            )}
        </div>
    );
}

export default Home;
