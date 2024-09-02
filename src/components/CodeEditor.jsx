import React, { useState, useRef, useEffect } from 'react';

function CodeEditor({ fileContent, onContentChange }) {
	const [lines, setLines] = useState(['1']);
	const textareaRef = useRef(null);
	const lineNumbersRef = useRef(null);

	useEffect(() => {
		const lineCount = fileContent.split('\n').length;
		const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);
		setLines(lineNumbers);
	}, [fileContent]);

	const handleScroll = () => {
		const scrollTop = textareaRef.current.scrollTop;

		// Ensure scrollTop is not negative (bounce effect)
		if (scrollTop < 0) {
			textareaRef.current.scrollTop = 0;
		}

		// Synchronize the line numbers with the text area
		if (lineNumbersRef.current) {
			lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
		}
	};

	return (
		<div
			className="flex w-full h-full bg-gray-900"
			style={{ maxHeight: '100vh', overflow: 'hidden' }}>
			<div
				ref={lineNumbersRef}
				id="line-numbers"
				className="bg-gray-800 text-gray-400 text-right pr-3 select-none overflow-hidden"
				style={{
					minWidth: '40px',
					lineHeight: '1.5rem',
					fontFamily: 'monospace',
					fontSize: '14px',
				}}>
				{lines.map((line) => (
					<div
						key={line}
						className="line-number">
						{line}
					</div>
				))}
			</div>
			<textarea
				ref={textareaRef}
				className="flex-1 w-full h-full p-0 bg-gray-800 text-white resize-none focus:outline-none border-none overflow-auto"
				style={{
					lineHeight: '1.5rem',
					fontFamily: 'monospace',
					fontSize: '14px',
				}}
				value={fileContent}
				onChange={(e) => onContentChange(e)}
				onScroll={handleScroll}
			/>
		</div>
	);
}

export default CodeEditor;
