import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Home from './pages/home';
import PastedCode from './pages/pastedCode';
import './App.css';

function App() {
	return (
		<Router>
			<div className="App">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/:id" element={<PastedCodePage />} />
					<Route path="*" element={<NoMatch />} />
				</Routes>
			</div>
		</Router>
	);
}

function PastedCodePage() {
	let { id } = useParams();
	return <PastedCode id={id} />; 
}

function NoMatch() {
	return <h1>404 Not Found</h1>;
}

export default App;
