import React from 'react';
import ReactDOM from 'react-dom/client';
import '@tabler/icons-webfont/dist/tabler-icons.css';
import 'flatpickr/dist/flatpickr.min.css';
import './style.css';
import App from './App';
import DevUtils from './utils/devUtils.js';

// Create root and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

// Expose DevUtils for development/debugging
if (typeof window !== 'undefined') {
	window.DevUtils = DevUtils;

	window.getCategories = () => DevUtils.getCategories();
	window.deleteAllCategories = () => DevUtils.deleteAllCategories();
	window.generateRandomTasks = (categoryName, count) =>
		DevUtils.generateRandomTasks(categoryName, count);
}
