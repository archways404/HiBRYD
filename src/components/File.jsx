import React from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { FaFolder, FaFolderOpen, FaFileAlt } from 'react-icons/fa'; // Example icons
import { SiRust, SiJavascript, SiJson } from 'react-icons/si'; // Specific icons for Rust, JavaScript, JSON, etc.

function File({ file, onSelectFile }) {
	const handleClick = () => {
		invoke('read_file_content', { filePath: file.full_path })
			.then((content) => {
				onSelectFile(file.full_path, content);
			})
			.catch((error) => {
				console.error('Error reading file:', error);
			});
	};

	// Determine the icon based on the file extension
	const getFileIcon = (fileName) => {
		const extension = fileName.split('.').pop().toLowerCase();
		switch (extension) {
			case 'rs':
				return <SiRust />;
			case 'js':
				return <SiJavascript />;
			case 'json':
				return <SiJson />;
			default:
				return <FaFileAlt />; // Default file icon
		}
	};

	return (
		<li>
			<button
				className="file-button flex items-center"
				onClick={handleClick}>
				{getFileIcon(file.name)} <span className="ml-2">{file.name}</span>
			</button>
		</li>
	);
}

export default File;
