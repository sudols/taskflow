import Note from '../models/Note.js';
import Category from '../models/Category.js';
import TaskCardRenderer from './TaskCardRenderer.js';

export default class Sidebar {
	static getCategoryTemplate(category) {
		return `
			<li
				class="p-2 hover:cursor-pointer hover:bg-generic-btn-hover categoryItem transition duration-200 rounded-md pl-4"
			>
				${category}
			</li>	
		`;
	}

	static toggleSideBarListener() {
		document.addEventListener('click', (event) => {
			if (event.target.closest('.menuOpen')) {
				this._toggleSidebar();
			}
			if (event.target.closest('.menuClose')) {
				this._toggleSidebar();
			}
		});
	}

	static _toggleSidebar() {
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

	static renderCategories() {
		const categories = Category.getAllCategories();
		const categoryContainer = document.querySelector('.categoryList');
		if (categoryContainer) {
			categoryContainer.innerHTML = '';
			categories.forEach((category) => {
				const categoryTemplate = this.getCategoryTemplate(category);
				categoryContainer.insertAdjacentHTML('beforeend', categoryTemplate);
			});
		}
	}

	static changeCategoryListener() {
		const categoryContainer = document.querySelector('.categoryList');
		if (categoryContainer) {
			categoryContainer.addEventListener('click', (event) => {
				const categoryItem = event.target.closest('.categoryItem');
				if (categoryItem) {
					const categoryName = categoryItem.textContent.trim();
					this.selectedCategory(categoryName);
					TaskCardRenderer.init(categoryName);
				}
			});
		}
	}

	static selectedCategory(categoryName) {
		const categoryItems = document.querySelectorAll('.categoryItem');
		categoryItems.forEach((item) => {
			if (item.textContent.trim() === categoryName) {
				item.classList.add('bg-generic-btn-hover');
			} else {
				item.classList.remove('bg-generic-btn-hover');
			}
		});
	}

	static initEventListeners() {
		this.toggleSideBarListener();
		this.renderCategories();
		this.changeCategoryListener();
	}

	static init() {
		this.initEventListeners();
	}
}
