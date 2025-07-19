import '@tabler/icons-webfont/dist/tabler-icons.css';
import 'flatpickr/dist/flatpickr.min.css';
import { TaskCardRenderer } from './components/TaskCardRenderer.js';
import './style.css';
import Sidebar from './components/SideBar.js';
import DevUtils from './utils/devUtils.js';

if (module.hot) {
	module.hot.accept();
}

Sidebar.init();

// Expose DevUtils for development/debugging
if (typeof window !== 'undefined') {
	window.DevUtils = DevUtils;

	window.getCategories = () => DevUtils.getCategories();
	window.deleteAllCategories = () => DevUtils.deleteAllCategories();
	window.generateRandomTasks = (categoryName, count) =>
		DevUtils.generateRandomTasks(categoryName, count);
}
