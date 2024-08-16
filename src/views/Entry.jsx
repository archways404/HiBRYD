import React from 'react';
import { useNavigate } from 'react-router-dom';
import { open } from '@tauri-apps/api/dialog';

function Entry() {
	const navigate = useNavigate();

	const handleGetStarted = async () => {
		// Open a folder selection dialog
		const selectedFolder = await open({
			directory: true,
			multiple: false,
			title: 'Select a Project Folder',
		});

		// If a folder was selected, navigate to the Project page with the folder path
		if (selectedFolder) {
			navigate('/Project', { state: { folderPath: selectedFolder } });
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<h1 className="text-5xl font-bold mb-8">Welcome to Your App</h1>
			<button
				onClick={handleGetStarted}
				className="bg-blue-500 text-white px-6 py-3 rounded-lg">
				Get Started
			</button>
		</div>
	);
}

export default Entry;
