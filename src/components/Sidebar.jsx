import React from 'react';
import Folder from './Folder';

function Sidebar({ folderData, onSelectFile }) {
	return (
		<div className="sidebar p-4 h-full overflow-y-auto">
			{folderData ? (
				<ul className="space-y-2">
					<Folder
						folder={folderData}
						onSelectFile={onSelectFile}
					/>
				</ul>
			) : (
				<p>No folder data available</p>
			)}
		</div>
	);
}

export default Sidebar;
