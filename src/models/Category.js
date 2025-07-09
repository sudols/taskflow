export default class Category {
	constructor(categoryName) {
		this.categoryName = categoryName;
	}

	static getStoredCategories() {
		return JSON.parse(localStorage.getItem('categories_index')) || {};
	}
	static saveCategories(categories) {
		localStorage.setItem('categories_index', JSON.stringify(categories));
	}

	static getCategoryNotes(categoryName) {
		return Category.getStoredCategories()[categoryName] || ['not found'];
	}
	static removeNoteFromCategory(noteID, categoryName) {
		let currentCategoryNotes = Category.getCategoryNotes(categoryName);
		if (currentCategoryNotes.includes(noteID)) {
			currentCategoryNotes = currentCategoryNotes.filter((id) => id !== noteID);

			const categoryIndex = Category.getStoredCategories() || {};
			categoryIndex[categoryName] = currentCategoryNotes;
			console.log(
				'Removed. \n Updated category notes:',
				categoryIndex[categoryName]
			);
			Category.saveCategories(categoryIndex);
		}
	}

	static deleteCategory(categoryName) {
		const storedCategories = Category.getStoredCategories();

		if (storedCategories[categoryName]) {
			delete storedCategories[categoryName];
			Category.saveCategories(storedCategories);
		} else {
			console.error(`Category "${categoryName}" does not exist.`);
		}
	}
	static createCategory(categoryName) {
		const storedCategories = Category.getStoredCategories();

		if (!storedCategories[categoryName]) {
			storedCategories[categoryName] = [];
			Category.saveCategories(storedCategories);
		} else {
			console.error(`Category "${categoryName}" already exists.`);
		}
	}
	static getAllCategories() {
		const storedCategories = Category.getStoredCategories();
		return Object.keys(storedCategories);
	}
	static categoryExists(categoryName) {
		const storedCategories = Category.getStoredCategories();
		return Object.hasOwn(storedCategories, categoryName);
	}
	static addNoteToCategory(categoryName = 'default', noteID) {
		const storedCategories = Category.getStoredCategories();

		if (storedCategories[categoryName]) {
			if (!storedCategories[categoryName].includes(noteID)) {
				storedCategories[categoryName].push(noteID);
				Category.saveCategories(storedCategories);
			}
		} else {
			console.warn(
				`Category "${categoryName}" does not exist. Creating it now.`
			);
			Category.createCategory(categoryName);
			// Get fresh categories after creating new one
			const updatedCategories = Category.getStoredCategories();
			updatedCategories[categoryName].push(noteID);
			Category.saveCategories(updatedCategories);
		}
	}
	static checkNoteInCategory(categoryName, noteID) {
		const storedCategories = Category.getStoredCategories();
		if (storedCategories[categoryName]) {
			return storedCategories[categoryName].includes(noteID);
		}
		return false;
	}
}
