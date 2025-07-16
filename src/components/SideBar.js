import Note from '../models/Note.js';
import Category from '../models/Category.js';
import TaskCardRenderer from './TaskCardRenderer.js';

export default class Sidebar {
	static getCategoryTemplate(category) {
		return `
			<li
				class=" hover:cursor-pointer hover:bg-generic-btn-hover categoryItem transition duration-200 rounded-md p-2 pl-4"
			>
			<span>
							${category} </span>
			</li>	
		`;
	}

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

	static renderCategories() {
		const categories = Category.getAll();
		const categoryContainer = document.querySelector('.categoryList');
		if (categoryContainer) {
			categoryContainer.innerHTML = '';
			categories.forEach((category) => {
				const categoryTemplate = this.getCategoryTemplate(category);
				categoryContainer.insertAdjacentHTML('beforeend', categoryTemplate);
			});
		}
	}

	static changeCategoryListener(event) {
		const categoryContainer = document.querySelector('.categoryList');
		if (categoryContainer) {
			// categoryContainer.addEventListener('click', (event) => {
			const categoryItem = event.target.closest('.categoryItem');
			if (categoryItem) {
				const categoryName = categoryItem.textContent.trim();
				this.selectedCategory(categoryName);
				TaskCardRenderer.init(categoryName);
			}
			// });
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

	static newCategoryListener(event) {
		const newCategoryInputTemplate = `
			<li
				class=" inline newCategoryLi hover:cursor-pointer hover:bg-generic-btn-hover transition duration-200 rounded-md pt-2 pb-2 pl-4"
			>
				<input
					class="newCategoryInput outline-none bg-transparent border-0 max-w-40 text-inherit font-inherit"
					type="text"
					name=""
					id="newCategory"
					placeholder="Name"
				/>
			</li>
		`;
		const addCategoryButton = document.querySelector('.addCategoryButton');
		const categoryList = document.querySelector('.categoryList');

		if (addCategoryButton && categoryList) {
			if (event.target.closest('.addCategoryButton')) {
				if (categoryList.querySelector('.newCategoryLi')) {
					categoryList.querySelector('.newCategoryLi').remove();
				}
				if (!categoryList.querySelector('.newCategoryLi')) {
					categoryList.insertAdjacentHTML(
						'afterbegin',
						newCategoryInputTemplate
					);
					this.newCategoryInputListener();
				}
			}
		}
	}

	static newCategoryInputListener() {
		const newCategoryInput = document.querySelector('.newCategoryInput');
		const newCategoryLi = document.querySelector('.newCategoryLi');
		const controller = new AbortController();
		if (newCategoryInput) {
			document.addEventListener(
				'click',
				(event) => {
					if (
						event.target !== newCategoryInput &&
						newCategoryInput.value.trim() !== ''
					) {
						// TODO: Handle case if create is trigger but category already exists
						Category.create(newCategoryInput.value.trim());

						newCategoryLi.remove();
						controller.abort();

						this.renderCategories();
					}

					if (
						event.target !== newCategoryInput &&
						newCategoryInput.value.trim() === ''
					) {
						newCategoryLi.remove();
						controller.abort();
					}
					// TODO: Handle case where user clicks on createCategory button but input has content. It should not create a new category if input has value && createCategory button is clicked.
				},
				{ signal: controller.signal }
			);
		}
	}

	static initEventListeners() {
		document.addEventListener('click', (event) => {
			if (
				event.target.closest('.menuOpen') ||
				event.target.closest('.menuClose')
			) {
				this.toggleSidebar();
			}

			this.changeCategoryListener(event);
			this.newCategoryListener(event);
		});
		// this.toggleSideBarListener();
		this.renderCategories();
	}

	static init() {
		this.initEventListeners();
	}
}
