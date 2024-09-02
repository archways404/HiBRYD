import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/tauri';
import Sidebar from '../components/Sidebar';
import Editor from '../components/Editor';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable';

function Project() {
	const location = useLocation();
	const folderPath = location.state?.folderPath;
	const [backendResponse, setBackendResponse] = useState(null);
	const [selectedFilePath, setSelectedFilePath] = useState(null);
	const [fileContent, setFileContent] = useState('');

	useEffect(() => {
		if (folderPath) {
			invoke('process_folder_path', { folderPath })
				.then((response) => {
					console.log('Response from backend:', response);
					setBackendResponse(JSON.parse(response));
				})
				.catch((error) => {
					console.error('Error processing folder path:', error);
				});
		}
	}, [folderPath]);

	const handleSelectFile = (filePath, content) => {
		setSelectedFilePath(filePath);
		setFileContent(content);
	};

	const handleContentChange = (event) => {
		setFileContent(event.target.value);
	};

	const handleSave = () => {
		invoke('write_file_content', {
			filePath: selectedFilePath,
			content: fileContent,
		})
			.then(() => {
				console.log('File saved successfully');
			})
			.catch((error) => {
				console.error('Error saving file:', error);
			});
	};

	return (
		<div
			className="dark flex flex-col h-screen max-h-screen bg-gray-900 text-white"
			style={{ overscrollBehavior: 'none' }}>
			<ResizablePanelGroup
				className="flex-1 flex max-h-full"
				direction="horizontal">
				<ResizablePanel className="w-1/5 bg-gray-800 h-full">
					<Sidebar
						folderData={backendResponse}
						onSelectFile={handleSelectFile}
					/>
				</ResizablePanel>
				<ResizableHandle className="w-1 bg-gray-700 cursor-col-resize" />
				<ResizablePanel className="flex-1 bg-gray-900 h-full">
					<Editor
						filePath={selectedFilePath}
						fileContent={fileContent}
						onContentChange={handleContentChange}
						onSave={handleSave}
					/>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}

export default Project;
