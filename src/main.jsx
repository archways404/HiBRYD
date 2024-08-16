import React from 'react';
import ReactDOM from 'react-dom/client';
import Entry from './views/Entry';
import Project from './views/Project';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Router>
			<Routes>
				<Route
					path="/"
					element={<Entry />}
				/>
				<Route
					path="/Project"
					element={<Project />}
				/>
			</Routes>
		</Router>
	</React.StrictMode>
);
