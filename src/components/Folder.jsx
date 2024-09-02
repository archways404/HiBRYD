import React, { useState } from 'react';
import File from './File';
import { FaFolder, FaFolderOpen } from 'react-icons/fa'; // Folder icons

function Folder({ folder, onSelectFile }) {
	const [isOpen, setIsOpen] = useState(false);

	const handleToggle = () => setIsOpen(!isOpen);

	return (
		<li>
			<div
				onClick={handleToggle}
				className="folder-summary flex items-center cursor-pointer">
				{isOpen ? <FaFolderOpen /> : <FaFolder />} {/* Folder icon */}
				<span className="ml-2">{folder.name}</span>
			</div>
			{isOpen && (
				<ul className="ml-4">
					{folder.subfolders.map((subfolder) => (
						<Folder
							key={subfolder.full_path}
							folder={subfolder}
							onSelectFile={onSelectFile}
						/>
					))}
					{folder.files.map((file) => (
						<File
							key={file.full_path}
							file={file}
							onSelectFile={onSelectFile}
						/>
					))}
				</ul>
			)}
		</li>
	);
}

export default Folder;
