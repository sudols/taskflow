import '@tabler/icons-webfont/dist/tabler-icons.css';
import 'flatpickr/dist/flatpickr.min.css';
import { TaskCardRenderer } from './components/TaskCardRenderer.js';
import './style.css';
import SideBar from './components/SideBar.js';

if (module.hot) {
	module.hot.accept();
}

Sidebar.init();
