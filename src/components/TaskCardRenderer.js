import Note from '../models/Note.js';
import Category from '../models/Category.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default class TaskCardRenderer {
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
							<button class="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 border border-transparent dueToday transition" type="button">Today</button>
							<button class="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 border border-transparent dueTomorrow transition" type="button">Tomorrow</button>
							<button class="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 border border-transparent dueCustomDate transition" type="button"><i class="ti ti-calendar-event"></i></button>
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

		const allDueButtons = [
			dueTodayButton,
			dueTomorrowButton,
			dueCustomDateButton,
		];

		// Helper function to clear all selected states
		const clearAllSelectedStates = () => {
			allDueButtons.forEach((btn) => {
				if (btn) {
					btn.classList.remove('bg-generic-btn-focus', 'border-gray-500');
					btn.classList.add('border-transparent');
				}
				if (
					btn === dueCustomDateButton &&
					btn.getElementsByTagName('i').length !== 1
				) {
					const child = document.createElement('i');
					child.classList.add('ti', 'ti-calendar-event');
					btn.innerHTML = '';
					btn.appendChild(child);
				}
			});
		};

		const addToggleButtonAndUpdateInstance = (button, formattedDate) => {
			button.classList.remove('border-transparent');
			button.classList.add('bg-generic-btn-focus', 'border-gray-500');

			noteInstance.updateNote({
				dueDate: formattedDate,
			});
		};

		const toggleRemoveButton = (button) => {
			// future implementation to toggle remove button
			// change to made remove focus when clicking only on X remove icon
			// else, openup calendar, similar to google tasks
			if (button.querySelector('.ti-x')) {
				button.querySelector('.ti-x').remove();
				return;
			}
			button.classList.add('flex', 'text-center', 'gap-1', 'items-center');
			const icon = document.createElement('i');
			icon.className = 'ti ti-x cursor-pointer text-white';
			button.appendChild(icon);
			// icon.addEventListener('click', (event) => {
			// 	event.preventDefault();
			// 	event.stopPropagation();
			// 	clearAllSelectedStates();
			// 	// button.classList.remove('bg-generic-btn-focus', 'border-gray-500');
			// 	// button.classList.add('border-transparent');
			// 	noteInstance.updateNote({
			// 		dueDate: '',
			// 	});
			// });
		};

		if (dueTodayButton) {
			dueTodayButton.addEventListener('click', (event) => {
				event.preventDefault();
				event.stopPropagation();
				const today = new Date();
				const formattedDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD

				if (dueTodayButton.classList.contains('bg-generic-btn-focus')) {
					clearAllSelectedStates();
					noteInstance.updateNote({
						dueDate: '',
					});
					return;
				}
				clearAllSelectedStates();
				addToggleButtonAndUpdateInstance(dueTodayButton, formattedDate);
			});
		}
		if (dueTomorrowButton) {
			dueTomorrowButton.addEventListener('click', (event) => {
				event.preventDefault();
				event.stopPropagation();
				if (dueTomorrowButton.classList.contains('bg-generic-btn-focus')) {
					clearAllSelectedStates();
					noteInstance.updateNote({
						dueDate: '',
					});
					return;
				}

				const tomorrow = new Date();
				tomorrow.setDate(tomorrow.getDate() + 1);
				const formattedDate = tomorrow.toISOString().split('T')[0]; // Format as YYYY-MM-DD

				clearAllSelectedStates();
				addToggleButtonAndUpdateInstance(dueTomorrowButton, formattedDate);
			});
		}

		// if (dueCustomDateButton) {
		// 	dueCustomDateButton.addEventListener('click', (event) => {
		// 		event.preventDefault();
		// 		event.stopPropagation();
		// 		event.stopImmediatePropagation();
		// 		// if (dueCustomDateButton.classList.contains('bg-generic-btn-focus')) {
		// 		// 	dueCustomDateButton.innerHTML =
		// 		// 		'<i class="ti ti-calendar-event"></i>';
		// 		// 	clearAllSelectedStates();
		// 		// 	noteInstance.updateNote({
		// 		// 		dueDate: '',
		// 		// 	});
		// 		// 	return;
		// 		// }

		// 		const buttonRect = dueCustomDateButton.getBoundingClientRect();
		// 		let dateInput = cardElement.querySelector('.hidden-date-input');
		// 		if (!dateInput) {
		// 			dateInput = document.createElement('input');
		// 			dateInput.type = 'text';
		// 			dateInput.className = 'hidden-date-input sr-only';
		// 			dateInput.style.position = 'absolute';
		// 			dateInput.style.visibility = 'hidden';
		// 			dueCustomDateButton.insertAdjacentElement('afterend', dateInput);
		// 		}
		// 		// calculates calendar position based on calendar's button position
		// 		dateInput.style.top = `${buttonRect.bottom + 5}px`;
		// 		dateInput.style.left = `${buttonRect.left - 8}px`;
		// 		// check if current event is active or in focus
		// 		clearAllSelectedStates();
		// 		dueCustomDateButton.classList.remove('border-transparent');
		// 		dueCustomDateButton.classList.add(
		// 			'bg-generic-btn-focus',
		// 			'border-gray-500'
		// 		);
		// 		if (document.activeElement === dateInput) {
		// 		}
		// 		// addToggleButtonAndUpdateInstance(dueCustomDateButton, formattedDate);

		// 		const fp = flatpickr(dateInput, {
		// 			dateFormat: 'Y-m-d',
		// 			onChange: (selectedDates, dateStr) => {
		// 				noteInstance.updateNote({
		// 					dueDate: dateStr,
		// 				});
		// 				dueCustomDateButton.textContent = dateStr;
		// 			},
		// 		});
		// 		fp.open();
		// 	});
		// }
		if (dueCustomDateButton) {
			dueCustomDateButton.addEventListener('click', (event) => {
				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();

				// Check if the custom date button is already selected
				if (!dueCustomDateButton.classList.contains('bg-generic-btn-focus')) {
					clearAllSelectedStates();
					dueCustomDateButton.classList.remove('border-transparent');
					dueCustomDateButton.classList.add(
						'bg-generic-btn-focus',
						'border-gray-500'
					);
				}

				// Only execute this styling code if the button is NOT already selected
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

				// calculates calendar position based on calendar's button position
				dateInput.style.top = `${buttonRect.bottom + 24}px`;
				dateInput.style.left = `${buttonRect.left - 7}px`;

				const fp = flatpickr(dateInput, {
					dateFormat: 'Y-m-d',
					onChange: (selectedDates, dateStr) => {
						noteInstance.updateNote({
							dueDate: dateStr,
						});
						dueCustomDateButton.textContent = dateStr;
					},
				});
				fp.open();
			});
		}
	}

	static attachInputListeners(cardElement, noteInstance) {
		const titleInput = cardElement.querySelector('#newTaskTitle');
		const descriptionInput = cardElement.querySelector('#newTaskDescription');

		if (cardElement) {
			cardElement.addEventListener('input', (event) => {
				if (event.target === titleInput) {
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
						if (Note.getNoteData(noteInstance.id)) {
							Note.deleteNote(noteInstance.id);
							Category.removeNoteFromCategory(noteInstance.id, 'default');
						}
					}
				}
			};

			document.addEventListener('click', handleClickOutside);
		}
	}

	static SaveCardData(cardElement, NoteInstance) {
		const titleInput = cardElement.querySelector('#newTaskTitle');
		const descriptionInput = cardElement.querySelector('#newTaskDescription');
		if (titleInput.value || descriptionInput.value) {
			NoteInstance.updateNote({
				title: titleInput.value,
				description: descriptionInput.value,
			});
			Note.createNote(NoteInstance);
		}
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
