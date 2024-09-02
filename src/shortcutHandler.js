// src/shortcuts.js
import shortcutsConfig from './shortcuts.json';

export function handleShortcuts(event, actions) {
	const { onSave } = actions;

	const shortcutMappings = {
		'Control+S': () => onSave && onSave(),
		'Meta+S': () => onSave && onSave(),
	};

	for (const [keyCombo, action] of Object.entries(shortcutsConfig)) {
		const keys = shortcutsConfig[keyCombo].keys;
		if (keys.includes(getKeyCombo(event))) {
			event.preventDefault();
			shortcutMappings[getKeyCombo(event)]();
		}
	}
}

function getKeyCombo(event) {
	let combo = '';
	if (event.ctrlKey) combo += 'Control+';
	if (event.metaKey) combo += 'Meta+';
	if (event.altKey) combo += 'Alt+';
	if (event.shiftKey) combo += 'Shift+';
	combo += event.key.toUpperCase();
	return combo;
}
