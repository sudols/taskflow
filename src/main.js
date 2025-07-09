import './style.css';
import '@tabler/icons-webfont/dist/tabler-icons.css';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

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
		// localStorage.setItem(this.id, JSON.stringify(this));
		// console.log('Note updated:', this);
	}

	toggleCompleted() {
		this.completed = !this.completed;
		this.modified = new Date().toISOString();
		localStorage.setItem(this.id, JSON.stringify(this));
		console.log('Note complete toggled:', this);
	}
	// noteInstance is an instance of Note class with existing data
	static createNote(noteInstance, categoryName = 'default') {
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
		if (Category.checkNoteInCategory(categoryName, noteInstance.id) === false) {
			// if (Category.categoryExists(categoryName)) {
			Category.addNoteToCategory(categoryName, noteInstance.id);
			console.log(
				`Note "${noteInstance.title}" created and added to category "${categoryName}".`
			);
			// }
		}
		// else {
		// 	Category.addNoteToCategory(categoryName, noteInstance.id);
		// 	console.log(
		// 		`Note "${noteInstance.title}" created and added to newly created category "${categoryName}".`
		// 	);
		// }
		return noteInstance;
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
/*
template for note card
				<div
					class="flex items-center gap-4 bg-task-card-bg p-4 rounded-lg mb-4 mt-4"
				>
					<div>
						<label
							class="flex items-center justify-center cursor-pointer relative"
						>
							<input
								checked
								type="checkbox"
								class="peer h-5 w-5 cursor-pointer appearance-none rounded border bg-sort-btn-bg border-checkbox-border checked:bg-checkbox-checked checked:border-0 transition"
								id="check-custom-icon"
							/>
							<span
								class="absolute text-checkbox-icon opacity-0 peer-checked:opacity-100 transition"
							>
								<i class="ti ti-check"></i>
							</span>
						</label>
					</div>
					<div class="w-full flex flex-col gap-2">
						<div>
							<div class="flex items-center justify-between">
								<input
									type="text"
									name="taskTitle"
									id="taskTitle"
									placeholder="Title"
									class="outline-none text-heading text-lg font-semibold w-full"
								/>
								<button
									type="button"
									class="cursor-pointer hover:bg-generic-btn-hover hover:rounded"
								>
									<i class="ti ti-dots-vertical"></i>
								</button>
							</div>
							<input
								type="text"
								name="TaskDescription"
								id="TaskDescription"
								class="outline-none text-body text-sm line-clamp-2"
								placeholder="details"
							/>
						</div>
						<div>
							<p class="text-body text-xs flex items-center gap-2">
								<span>Due: </span>
								<button
									class="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 taskDueToday"
									type="button"
									data-note-id="sample-uuid"
								>
									Today
								</button>
								<button
									class="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 taskDueTomorrow"
									type="button"
									data-note-id="sample-uuid"
								>
									Tomorrow
								</button>
								<button
									class="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 taskDueCustomDate"
									type="button"
									data-note-id="sample-uuid"
									type="button"
								>
									<i
										class="ti ti-calendar-event"
										data-note-id="sample-uuid"
									></i>
								</button>
							</p>
						</div>
					</div>
				</div>

template for card three dot menu
				<div
					class="flex flex-col mb-4 w-25 bg-generic-btn-focus rounded-md text-heading"
				>
					<div
						class="flex items-center p-2 gap-2 hover:bg-gray-600 hover:rounded-md hover:rounded-b-none"
					>
						<i class="ti ti-edit"></i>
						<button type="button">Edit</button>
					</div>
					<div
						class="flex items-center p-2 gap-2 hover:bg-gray-600 hover:rounded-md hover:rounded-t-none"
					>
						<i class="ti ti-trash"></i>
						<button type="button">Delete</button>
					</div>
				</div>


*/
class TaskCardRenderer {
	static createNewCardTemplate() {
		const cardTemplate = `
			<div class="flex items-center gap-4 bg-task-card-bg p-4 rounded-lg newCardContainer">
				<div>
					<label class="flex items-center justify-center cursor-pointer relative">
						<input
							type="checkbox"
							class="peer h-5 w-5 cursor-pointer appearance-none rounded border bg-sort-btn-bg border-checkbox-border checked:bg-checkbox-checked checked:border-0 transition
							"
						/>
						<span class="absolute text-checkbox-icon opacity-0 peer-checked:opacity-100 transition">
							<i class="ti ti-check"></i>
						</span>
					</label>
				</div>
				<div class="w-full flex flex-col gap-2">
					<div>
						<div class="flex items-center justify-between">
							<input
								type="text"
								name="newTaskTitle"
								id="newTaskTitle"
								placeholder="Title"
								class="outline-none text-heading text-lg font-semibold w-full"
							/>
							<button type="button" class="cursor-pointer hover:bg-generic-btn-hover hover:rounded">
								<i class="ti ti-dots-vertical"></i>
							</button>
						</div>
						<input
							type="text"
							name="newTaskDescription"
							id="newTaskDescription"
							class="outline-none text-body text-sm line-clamp-2"
							placeholder="details"
						/>
					</div>
					<div>
						<p class="text-body text-xs flex items-center gap-2">
							<span>Due: </span>
							<button class="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 dueToday" type="button">Today</button>
							<button class="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 dueTomorrow" type="button">Tomorrow</button>
							<button class="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 dueCustomDate" type="button"><i class="ti ti-calendar-event"></i></button>
						</p>
					</div>
				</div>
			</div>`;
		const triggerButton = document.querySelector('.newTaskButton');
		const container = document.querySelector('.cardDisplayContainer');
		if (container) {
			if (container.innerHTML.includes('newCardContainer')) {
				container.querySelector('.newCardContainer').remove();
			}
			container.appendChild(
				document.createRange().createContextualFragment(cardTemplate)
			);
		}
		// attach a new Note class to cardtemplate
		const newCard = container.querySelector('.newCardContainer');
		if (newCard) {
			const newNote = new Note({
				id: crypto.randomUUID(),
				title: '',
				description: '',
				dueDate: '',
				priority: 'normal',
				created: new Date().toISOString(),
				modified: new Date().toISOString(),
				completed: false,
			});
			newCard.dataset.noteId = newNote.id;
			return { cardElement: newCard, noteInstance: newNote };
		}
	}

	static attachCalendarListeners(cardElement, noteInstance) {
		const dueCustomDateButton = cardElement.querySelector('.dueCustomDate');
		const dueTodayButton = cardElement.querySelector('.dueToday');
		const dueTomorrowButton = cardElement.querySelector('.dueTomorrow');

		if (dueTodayButton) {
			dueTodayButton.addEventListener('click', (event) => {
				event.preventDefault();
				event.stopPropagation();
				const today = new Date();
				const formattedDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
				noteInstance.updateNote({
					dueDate: formattedDate,
				});
			});
		}
		if (dueTomorrowButton) {
			dueTomorrowButton.addEventListener('click', (event) => {
				event.preventDefault();
				event.stopPropagation();
				const tomorrow = new Date();
				tomorrow.setDate(tomorrow.getDate() + 1);
				const formattedDate = tomorrow.toISOString().split('T')[0]; // Format as YYYY-MM-DD
				noteInstance.updateNote({
					dueDate: formattedDate,
				});
			});
		}

		if (dueCustomDateButton) {
			dueCustomDateButton.addEventListener('click', (event) => {
				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();
				const buttonRect = dueCustomDateButton.getBoundingClientRect();
				let dateInput = cardElement.querySelector('.hidden-date-input');
				if (!dateInput) {
					dateInput = document.createElement('input');
					dateInput.type = 'text';
					dateInput.className = 'hidden-date-input sr-only';
					dateInput.style.position = 'absolute';
					dateInput.style.visibility = 'hidden';
					dueCustomDateButton.insertAdjacentElement('afterend', dateInput);
				}
				// calendar position
				dateInput.style.top = `${buttonRect.bottom + 5}px`;
				dateInput.style.left = `${buttonRect.left - 8}px`;

				const fp = flatpickr(dateInput, {
					dateFormat: 'Y-m-d',
					onChange: (selectedDates, dateStr) => {
						noteInstance.updateNote({
							dueDate: dateStr,
						});
					},
				});
				fp.open();
			});
		}
	}

	static attachInputListeners(cardElement, noteInstance) {
		console.log(cardElement);
		const titleInput = cardElement.querySelector('#newTaskTitle');
		const descriptionInput = cardElement.querySelector('#newTaskDescription');
		// console.log(saveData);
		if (cardElement) {
			cardElement.addEventListener('input', (event) => {
				if (event.target === titleInput) {
					// noteInstance.title = titleInput.value;
					noteInstance.updateNote({
						title: titleInput.value,
					});

					TaskCardRenderer.SaveCardData(cardElement, noteInstance);
				} else if (event.target === descriptionInput) {
					noteInstance.description = descriptionInput.value;
					noteInstance.updateNote({
						description: descriptionInput.value,
					});
					TaskCardRenderer.SaveCardData(cardElement, noteInstance);
				}
			});
		}
	}

	static attachRemoveNewCardTemplate(cardElement, noteInstance) {
		if (cardElement) {
			const textInput = cardElement.querySelector('#newTaskTitle');
			const descriptionInput = cardElement.querySelector('#newTaskDescription');

			const handleClickOutside = (event) => {
				if (!cardElement.contains(event.target)) {
					// Check if both inputs are empty
					if (!textInput.value.trim() && !descriptionInput.value.trim()) {
						cardElement.remove();
						document.removeEventListener('click', handleClickOutside);
						Note.deleteNote(noteInstance.id);
						Category.removeNoteFromCategory(noteInstance.id, 'default');
					}
				}
			};

			// Add click listener to document
			document.addEventListener('click', handleClickOutside);
		}
	}

	static SaveCardData(cardElement, NoteInstance) {
		const titleInput = cardElement.querySelector('#newTaskTitle');
		const descriptionInput = cardElement.querySelector('#newTaskDescription');
		// const saveCardData = () => {
		if (titleInput.value || descriptionInput.value) {
			NoteInstance.updateNote({
				title: titleInput.value,
				description: descriptionInput.value,
			});
			Note.createNote(NoteInstance);
			console.log('Card data saved:', NoteInstance);
		}
		// };
		// console.log(typeof saveCardData);
		// return saveCardData;
	}

	static renderCards(noteIds, containerId) {
		// Render multiple cards in container
	}

	static updateCard(noteId) {}

	static initializeEventListeners() {
		document.addEventListener('click', (event) => {
			if (event.target.classList.contains('newTaskButton')) {
				const { cardElement, noteInstance } =
					TaskCardRenderer.createNewCardTemplate();

				TaskCardRenderer.attachInputListeners(cardElement, noteInstance);
				TaskCardRenderer.attachCalendarListeners(cardElement, noteInstance);
				TaskCardRenderer.attachRemoveNewCardTemplate(cardElement, noteInstance);
			}
		});
	}
	static init() {
		this.initializeEventListeners();
	}
}

TaskCardRenderer.init();
