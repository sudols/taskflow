import Category from './Category';
console.log(typeof crypto.randomUUID);

export default class Note {
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

	update(updatesObj) {
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
	}

	toggle() {
		this.completed = !this.completed;
		this.modified = new Date().toISOString();
		localStorage.setItem(this.id, JSON.stringify(this));
	}

	static create(noteInstance, categoryName = 'default') {
		if (noteInstance instanceof Note) {
			let noteObj = {
				id: noteInstance.id,
				title: noteInstance.title,
				description: noteInstance.description,
				dueDate: noteInstance.dueDate,
				priority: noteInstance.priority,
				created: noteInstance.created,
				modified: noteInstance.modified,
				completed: noteInstance.completed,
			};
			localStorage.setItem(noteInstance.id, JSON.stringify(noteObj));
		}
		if (Category.hasNote(categoryName, noteInstance.id) === false) {
			Category.addNote(categoryName, noteInstance.id);
		}
		return noteInstance;
	}

	static delete(noteID) {
		const noteData = localStorage.getItem(noteID);
		if (noteData) {
			localStorage.removeItem(noteID);
			console.log(`Note with ID "${noteID}" deleted.`);
		} else {
			console.error(`Note with ID "${noteID}" not found.`);
		}
	}

	static get(noteID) {
		const noteData = localStorage.getItem(noteID);
		if (noteData) {
			return new Note(JSON.parse(noteData));
		}
		return null;
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
