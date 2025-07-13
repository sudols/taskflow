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
							<button type="button" class="cursor-pointer hover:bg-generic-btn-hover hover:rounded hidden threeDotMenu transition">
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
							<span class="dueDateContainer"> 
								<button class="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 border border-transparent dueToday transition" type="button">Today</button>
								<button class="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 border border-transparent dueTomorrow transition" type="button">Tomorrow</button>
								<button class="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 border border-transparent dueCustomDate transition" type="button"><i class="ti ti-calendar-event"></i></button>
							</span>
						</p>
					</div>
				</div>
			</div>`;
		const triggerButton = document.querySelector('.newTaskButton');
		const container = document.querySelector('.cardDisplayContainer');
		if (container) {
			if (container.innerHTML.includes('newCardContainer')) {
				const existingCard = container.querySelector('.newCardContainer');
				existingCard._abortController.abort();
				existingCard.remove();
			}
			const controller = new AbortController();

			container.insertAdjacentHTML('afterbegin', cardTemplate);
			const newCardElement = container.querySelector('.newCardContainer');
			if (newCardElement) {
				const newNoteInstance = new Note({
					id: crypto.randomUUID(),
					title: '',
					description: '',
					dueDate: '',
					priority: 'normal',
					created: new Date().toISOString(),
					modified: new Date().toISOString(),
					completed: false,
				});
				newCardElement.dataset.noteId = newNoteInstance.id;
				newCardElement._abortController = controller;
				return {
					cardElement: newCardElement,
					noteInstance: newNoteInstance,
					controller: controller,
				};
			}
			console.error('failed to create new card element');
			return null;
			// append on top of container
			// container.appendChild(
			// 	document.createRange().createContextualFragment(cardTemplate)
			// );
		}
		// attach a new Note class to cardtemplate
	}

	static attachCalendarListeners(cardElement, noteInstance, controller) {
		const dueCustomDateButton = cardElement.querySelector('.dueCustomDate');
		const dueTodayButton = cardElement.querySelector('.dueToday');
		const dueTomorrowButton = cardElement.querySelector('.dueTomorrow');
		const dueDateContainer = cardElement.querySelector('.dueDateContainer');

		const allDueButtons = [
			dueTodayButton,
			dueTomorrowButton,
			dueCustomDateButton,
		];

		// Helper function to clear all selected states
		const clearAllSelectedStates = () => {
			allDueButtons.forEach((btn) => {
				btn.classList.remove('bg-generic-btn-focus', 'border-gray-500');
				btn.classList.add('border-transparent');
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

		const addFocusAndUpdateInstance = (button, formattedDate) => {
			button.classList.remove('border-transparent');
			button.classList.add('bg-generic-btn-focus', 'border-gray-500');

			noteInstance.updateNote({
				dueDate: formattedDate,
			});
		};

		// const toggleRemoveButton = (button) => {
		// 	// future implementation to toggle remove button
		// 	// change to made remove focus when clicking only on X remove icon
		// 	// else, openup calendar, similar to google tasks
		// 	if (button.querySelector('.ti-x')) {
		// 		button.querySelector('.ti-x').remove();
		// 		return;
		// 	}
		// 	button.classList.add('flex', 'text-center', 'gap-1', 'items-center');
		// 	const icon = document.createElement('i');
		// 	icon.className = 'ti ti-x cursor-pointer text-white';
		// 	button.appendChild(icon);
		// 	// icon.addEventListener('click', (event) => {
		// 	// 	event.preventDefault();
		// 	// 	event.stopPropagation();
		// 	// 	clearAllSelectedStates();
		// 	// 	// button.classList.remove('bg-generic-btn-focus', 'border-gray-500');
		// 	// 	// button.classList.add('border-transparent');
		// 	// 	noteInstance.updateNote({
		// 	// 		dueDate: '',
		// 	// 	});
		// 	// });
		// };

		if (dueDateContainer) {
			dueDateContainer.addEventListener(
				'click',
				(event) => {
					event.preventDefault();
					event.stopPropagation();

					if (event.target.classList.contains('dueToday')) {
						if (dueTodayButton.classList.contains('bg-generic-btn-focus')) {
							clearAllSelectedStates();
							noteInstance.updateNote({
								dueDate: '',
							});
							Note.createNote(noteInstance);
							return;
						}
						const today = new Date();
						const formattedDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
						clearAllSelectedStates();
						addFocusAndUpdateInstance(dueTodayButton, formattedDate);
					}
					if (event.target.classList.contains('dueTomorrow')) {
						if (dueTomorrowButton.classList.contains('bg-generic-btn-focus')) {
							clearAllSelectedStates();
							noteInstance.updateNote({
								dueDate: '',
							});
							Note.createNote(noteInstance);
							return;
						}
						const today = new Date();
						today.setDate(today.getDate() + 1);
						const formattedDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
						clearAllSelectedStates();
						addFocusAndUpdateInstance(dueTomorrowButton, formattedDate);
					}
					if (event.target.closest('.dueCustomDate')) {
						if (!event.target.classList.contains('bg-generic-btn-focus')) {
							clearAllSelectedStates();
						}
						dueCustomDateButton.classList.remove('border-transparent');
						dueCustomDateButton.classList.add(
							'bg-generic-btn-focus',
							'border-gray-500'
						);

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
								Note.createNote(noteInstance);
							},
						});
						fp.open();
					}
					Note.createNote(noteInstance);
				},
				{ signal: controller.signal }
			);
		}
	}

	static attachInputListeners(cardElement, noteInstance, controller) {
		const titleInput = cardElement.querySelector('#newTaskTitle');
		const descriptionInput = cardElement.querySelector('#newTaskDescription');

		if (cardElement) {
			const eventHandler = (event) => {
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
			};
			cardElement.addEventListener('input', eventHandler, {
				signal: controller.signal,
			});
		}
	}

	static attachRemoveNewCardTemplate(cardElement, noteInstance, controller) {
		if (cardElement) {
			const textInput = cardElement.querySelector('#newTaskTitle');
			const descriptionInput = cardElement.querySelector('#newTaskDescription');

			// const controller = new AbortController();
			// cardElement._abortController = controller;

			const handleClickOutside = (event) => {
				if (!cardElement.contains(event.target)) {
					// Check if both inputs are empty
					if (!textInput.value.trim() && !descriptionInput.value.trim()) {
						controller.abort();
						cardElement.remove();
						if (Note.getNoteData(noteInstance.id)) {
							Note.deleteNote(noteInstance.id);
							Category.removeNoteFromCategory(noteInstance.id, 'default');
						}
					}
				}
			};

			document.addEventListener('click', handleClickOutside, {
				signal: controller.signal,
			});
			// cardElement._removeEventListener = handleClickOutside;
		}
	}

	static attachThreeDotMenuListeners(cardElement, noteInstance, controller) {
		// check if data exist in input elements, if yes, then enable the three dot menu else don'nt
		const threeDotMenu = cardElement.querySelector('.threeDotMenu');
		const titleInput = cardElement.querySelector('#newTaskTitle');
		const descriptionInput = cardElement.querySelector('#newTaskDescription');

		cardElement.addEventListener(
			'input',
			() => {
				if (titleInput.value.trim() || descriptionInput.value.trim()) {
					threeDotMenu.classList.remove('hidden');
				} else {
					threeDotMenu.classList.add('hidden');
				}
			},
			{
				signal: controller.signal,
			}
		);
	}

	static attachPushToRenderContainerListeners(
		cardElement,
		noteInstance,
		controller
	) {
		// push the note to the render container only if there exist any data in the input elements
		// dont create new card in storage as it is already created
		const container = document.querySelector('.cardDisplayContainer');

		// check if click is done outside cardelement's container
		// const controller = new AbortController();
		function addElementToContainer(event) {
			if (
				!cardElement.contains(event.target) &&
				Note.getNoteData(noteInstance.id)
			) {
				// append as first child of container
				container.insertAdjacentElement('afterbegin', cardElement);
				cardElement.dataset.noteId = noteInstance.id;
				cardElement.classList.remove('newCardContainer');
				cardElement.classList.add('taskCard');

				if (cardElement._abortController) {
					cardElement._abortController.abort();
					delete cardElement._abortController;
				}
				// const clonedElement = cardElement.cloneNode(true);
				const a = document.createElement('span');
				a.textContent = 'task';
				// clonedElement.appendChild(a);
				cardElement.appendChild(a);
				// cardElement.parentNode.replaceChild(clonedElement, cardElement);

				// document.removeEventListener('click', addElementToContainer);
				controller.abort();
			}
		}
		document.addEventListener('click', addElementToContainer, {
			signal: controller.signal,
		});
		const observer = new MutationObserver((mutationsList) => {
			if (!container.querySelector('.newCardContainer')) {
				controller.abort();
				observer.disconnect();
			}
		});
		observer.observe(container, {
			childList: true,
			subtree: true,
		});
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

	static createCard(noteInstance) {
		const cardTemplate = `
			<div class="flex items-center gap-4 bg-task-card-bg p-4 rounded-lg taskCard">
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
					<div class="flex items-center justify-between">
						<input
							type="text"
							name="newTaskTitle"
							id="newTaskTitle"
							placeholder="Title"
							value="${noteInstance.title || ''}"
							class="outline-none text-heading text-lg font-semibold w-full"
						/>
						<button type="button" class="cursor-pointer hover:bg-generic-btn-hover hover:rounded hidden threeDotMenu transition">
							<i class="ti ti-dots-vertical"></i>
						</button>
					</div>
					${
						noteInstance.description !== ''
							? `
					<div class="dueContainer">
						<input
							type="text"
							name="newTaskDescription"
							id="newTaskDescription"
							class="outline-none text-body text-sm line-clamp-2"
							placeholder="details"
							value="${noteInstance.description || ''}"
						/>
					</div>
						`
							: `
						<div class="dueContainer hidden">
						</div>
							`
					}
					${
						noteInstance.dueDate !== ''
							? `
					<div class="dueDateParentContainer">
						<p class="text-body text-xs flex items-center gap-2 dueDateContainer">
							<span>Due: </span>
							<button class="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 border border-transparent dueToday transition" type="button">${noteInstance.dueDate}</button>
						</p>
					</div>
						`
							: `
					<div class="dueDateParentContainer hidden">
					</div>
						`
					}
				</div>
			</div>`;
		const container = document.querySelector('.cardDisplayContainer');
		if (container) {
			container.insertAdjacentHTML('afterbegin', cardTemplate);
		}
	}

	static renderCards(categoryName) {
		const notes = Category.getCategoryNotes(categoryName);
		const container = document.querySelector('.cardDisplayContainer');
		if (container) {
			container.innerHTML = '';
			notes.forEach((noteId) => {
				TaskCardRenderer.createCard(Note.getNoteData(noteId));
			});
		}
	}

	static updateCard(noteId) {}

	static initializeEventListeners() {
		document.addEventListener('click', (event) => {
			if (event.target.classList.contains('newTaskButton')) {
				const { cardElement, noteInstance, controller } =
					TaskCardRenderer.createNewCardTemplate();
				TaskCardRenderer.attachInputListeners(
					cardElement,
					noteInstance,
					controller
				);
				TaskCardRenderer.attachCalendarListeners(
					cardElement,
					noteInstance,
					controller
				);
				TaskCardRenderer.attachRemoveNewCardTemplate(
					cardElement,
					noteInstance,
					controller
				);
				TaskCardRenderer.attachThreeDotMenuListeners(
					cardElement,
					noteInstance,
					controller
				);
				TaskCardRenderer.attachPushToRenderContainerListeners(
					cardElement,
					noteInstance,
					controller
				);
			}
			if (event.target.classList.contains('taskCard')) {
				const cardElement = event.target;
				const noteId = cardElement.dataset.noteId;
				if (cardElement._abortController) {
					cardElement._abortController.abort();
					delete cardElement._abortController;
				}
				const controller = new AbortController();
				cardElement._abortController = controller;
				if (noteId) {
					const noteInstance = Note.getNoteData(noteId);
					if (noteInstance) {
						TaskCardRenderer.attachInputListeners(
							cardElement,
							noteInstance,
							cardElement._abortController
						);
						TaskCardRenderer.attachCalendarListeners(
							cardElement,
							noteInstance,
							cardElement._abortController
						);
						TaskCardRenderer.attachThreeDotMenuListeners(
							cardElement,
							noteInstance,
							cardElement._abortController
						);
					}
				}
			}
		});
	}
	static init() {
		this.initializeEventListeners();
	}
}
TaskCardRenderer.init();

// trigger render on page load
document.addEventListener('DOMContentLoaded', () => {
	TaskCardRenderer.renderCards('default');
});
