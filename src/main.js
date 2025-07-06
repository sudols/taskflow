import './style.css';
import '@tabler/icons-webfont/dist/tabler-icons.css';

console.log('App started!');

class Category {
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

	getCategoryNotes() {
		return Category.getStoredCategories()[this.categoryName] || ['not found'];
		// return this.categoIndex[this.currentCategory] || ['not found'];
	}
	removeNoteFromCategory(noteID) {
		let currentCategoryNotes = this.getCategoryNotes();
		if (currentCategoryNotes.includes(noteID)) {
			currentCategoryNotes = currentCategoryNotes.filter((id) => id !== noteID);

			const categoryIndex = Category.getStoredCategories() || {};
			categoryIndex[this.categoryName] = currentCategoryNotes;
			// this.categoryIndex[this.currentCategory] = currentCategoryNotes;
			console.log(
				'Updated category notes:',
				categoryIndex[this.categoryName]
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
			} else {
				console.error(
					`Note "${noteID}" already exists in category "${categoryName}".`
				);
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
}
// Each note stored with unique key
// "uuid": {
//   id: "uuid",
//   title: "Meeting Notes",
//   description: "Discuss project timeline and deliverables",
//   dueDate: "2025-07-10T00:00:00Z",
//   priority: "high",
//   created: "2025-07-05T15:23:00Z",
//   modified: "2025-07-05T15:23:00Z",
//   completed: false
// }

class Note {
	constructor(noteObj) {
		this.id = noteObj.id || crypto.randomUUID();
		this.title = noteObj.title || '';
		this.description = noteObj.description || '';
		this.dueDate = noteObj.dueDate || '';
		this.priority = noteObj.priority || 'normal';
		this.created = noteObj.created || new Date().toISOString();
		this.modified = noteObj.modified || new Date().toISOString();
		this.completed = noteObj.completed || false;
	}

	// // Helper methods for Note storage
	// static getStoredNote(noteID) {
	// 	const noteData = localStorage.getItem(`note_${noteID}`);
	// 	return noteData ? JSON.parse(noteData) : null;
	// }

	// static saveNote(note) {
	// 	localStorage.setItem(`note_${note.id}`, JSON.stringify(note));
	// }

	updateNote(updatesObj) {
		const allowedFields = [
			'title',
			'description',
			'dueDate',
			'priority',
			'completed',
		];

		for (const key in updatesObj) {
			if (allowedFields.includes(key)) {
				this[key] = updatesObj[key];
			} else {
				console.warn(`Field "${key}" is not allowed to be updated.`);
			}
		}

		this.modified = new Date().toISOString();
		localStorage.setItem(this.id, JSON.stringify(this));
		console.log('Note updated:', this);
	}

	toggleCompleted() {
		this.completed = !this.completed;
		this.modified = new Date().toISOString();
		localStorage.setItem(this.id, JSON.stringify(this));
		console.log('Note complete toggled:', this);
	}

	static createNote(data, categoryName) {
		const note = new Note(data);
		localStorage.setItem(note.id, JSON.stringify(note));

		if (Category.categoryExists(categoryName)) {
			Category.addNoteToCategory(categoryName, note.id);
			console.log(
				`Note "${note.title}" created and added to category "${categoryName}".`
			);
		} else {
			Category.addNoteToCategory(categoryName, note.id);
			console.log(
				`Note "${note.title}" created and added to newly created category "${categoryName}".`
			);
		}

		return note;
	}

	static deleteNote(noteID) {
		const noteData = localStorage.getItem(noteID);
		if (noteData) {
			localStorage.removeItem(noteID);
			console.log(`Note with ID "${noteID}" deleted.`);

			// // Also remove the note from all categories
			// const allCategories = Category.getAllCategories();
			// allCategories.forEach((categoryName) => {
			// 	const category = new Category(categoryName);
			// 	category.removeNoteFromCategory(noteID);
			// });
		} else {
			console.error(`Note with ID "${noteID}" not found.`);
		}
	}

	static getNoteData(noteID) {
		const noteData = localStorage.getItem(noteID);
		if (noteData) {
			return new Note(JSON.parse(noteData));
		} else {
			console.error(`Note with ID "${noteID}" not found.`);
			return null;
		}
	}

	// static getAllNotes() {
	// 	const allNoteIds = [];
	// 	const categories = Category.getStoredCategories();
	// 	for (const category in categories) {
	// 		allNoteIds.push(...categories[category]);
	// 	}
	// 	// This will have duplicate IDs if a note is in multiple categories, so let's use a Set.
	// 	const uniqueNoteIds = [...new Set(allNoteIds)];
	// 	return uniqueNoteIds
	// 		.map((id) => Note.getNoteData(id))
	// 		.filter((note) => note !== null);
	// }
}

if (module.hot) {
	module.hot.accept();
}

/*
example usage
setting default category
pushing 3 random notes to category
getting notes from default category
console logging notes

setting work category
pushing 2 random notes to work category
getting notes from work category
console logging notes

delete 1 note from work
then delete work category
*/
