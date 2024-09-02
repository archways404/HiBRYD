import React, { useEffect } from 'react';
import CodeEditor from './CodeEditor';
import { handleShortcuts } from '../shortcutHandler';

function Editor({ filePath, fileContent, onContentChange, onSave }) {
	useEffect(() => {
		const handleKeyDown = (event) => {
			handleShortcuts(event, { onSave });
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [onSave]);

	const fileName = filePath ? filePath.split('/').pop() : '';

	return (
		<div className="editor flex flex-col w-full h-full min-h-0">
			{filePath ? (
				<>
					{/* <h2 className="mb-2 text-sm text-gray-400">{fileName}</h2> */}
					<div className="flex-1 flex flex-col min-h-0">
						<CodeEditor
							fileContent={fileContent}
							onContentChange={onContentChange}
						/>
					</div>
				</>
			) : (
				<p className="text-gray-500">Select a file to start editing</p>
			)}
		</div>
	);
}

export default Editor;
