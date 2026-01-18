import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Home from './pages/home';
import PastedCode from './pages/pastedCode';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:id" element={<PastedCodePage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

function PastedCodePage() {
    const { id } = useParams();
    return <PastedCode id={id} />;
}

function NotFound() {
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
                    <h1 className="text-8xl font-bold text-purple-400 mb-4">404</h1>
                    <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
                    <p className="text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        <i className="fas fa-home"></i>
                        Go Home
                    </a>
                </div>
            </main>
        </div>
    );
}

export default App;
