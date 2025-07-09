export default class Category {
	constructor(categoryName) {
		this.categoryName = categoryName;
	}

	// Helper
	static getStoredCategories() {
		return JSON.parse(localStorage.getItem('categories_index')) || {};
	}
	// Helper
	static saveCategories(categories) {
		localStorage.setItem('categories_index', JSON.stringify(categories));
	}

	static getCategoryNotes(categoryName) {
		return Category.getStoredCategories()[categoryName] || ['not found'];
		// return this.categoIndex[this.currentCategory] || ['not found'];
	}
	static removeNoteFromCategory(noteID, categoryName) {
		let currentCategoryNotes = Category.getCategoryNotes(categoryName);
		// console.log('current category notes', currentCategoryNotes);
		if (currentCategoryNotes.includes(noteID)) {
			// if (currentCategoryNotes[categoryName]) {
			currentCategoryNotes = currentCategoryNotes.filter((id) => id !== noteID);

			const categoryIndex = Category.getStoredCategories() || {};
			categoryIndex[categoryName] = currentCategoryNotes;
			// this.categoryIndex[this.currentCategory] = currentCategoryNotes;
			console.log(
				'Removed. \n Updated category notes:',
				categoryIndex[categoryName]
				// Category.getStoredCategories()[this.categoryName]
				// this.categoryIndex[this.currentCategor]
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
			// else {
			// 	console.error(
			// 		`Note "${noteID}" already exists in category "${categoryName}".`
			// 	);
			// }
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
