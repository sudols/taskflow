import Note from '../models/Note.js';
import Category from '../models/Category.js';

export default class Sidebar {
	static toggleSidebar() {
		const sidebar = document.querySelector('.sidebar');
		const mainDisplay = document.querySelector('.mainDisplay');
		if (sidebar) {
			if (sidebar.classList.contains('hidden')) {
				sidebar.classList.remove('hidden');
				mainDisplay.classList.add('ml-80');
				mainDisplay.classList.remove('ml-20');
			} else {
				sidebar.classList.add('hidden');
				mainDisplay.classList.remove('ml-80');
				mainDisplay.classList.add('ml-20');
			}
		}
	}

	static toggleSideBarListener() {
		document.addEventListener('click', (event) => {
			if (event.target.closest('.menuOpen')) {
				this.toggleSidebar();
			}
			if (event.target.closest('.menuClose')) {
				this.toggleSidebar();
			}
		});
	}

	static initEventListeners() {
		this.toggleSideBarListener();
	}
}

Sidebar.initEventListeners();
