import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/tauri';

function Project() {
	const location = useLocation();
	const folderPath = location.state?.folderPath;
	const [backendResponse, setBackendResponse] = useState(null);

	useEffect(() => {
		if (folderPath) {
			// Send the folder path to the Tauri backend and handle the response
			invoke('process_folder_path', { folderPath })
				.then((response) => {
					console.log('Response from backend:', response);
					setBackendResponse(response);
				})
				.catch((error) => {
					console.error('Error processing folder path:', error);
				});
		}
	}, [folderPath]);

	return (
		<div className="dark flex flex-col min-h-screen">
			<div className="flex-none p-4">
				<h1 className="text-4xl pt-2 font-bold text-center">Upload files</h1>
			</div>
			<main className="flex-1 flex flex-col items-center p-4">
				{folderPath ? (
					<p>Selected folder: {folderPath}</p>
				) : (
					<p>No folder selected</p>
				)}
				{backendResponse && <p>Response from backend: {backendResponse}</p>}
				{/* Add your file upload or other project-related UI here */}
			</main>
		</div>
	);
}

export default Project;
