import flatpickr from 'flatpickr';
import Note from '../models/Note.js';
import Category from '../models/Category.js';
import CardTemplateManager from './CardTemplateManager.js';
import TaskCardRenderer from './TaskCardRenderer.js';

/**
 * CardEventManager - Handles all event listeners for task cards
 */
export default class CardEventManager {
	/**
	 * Attach calendar/date picker event listeners
	 */
	static attachCalendarListeners(cardElement, noteInstance, controller) {
		const elements = this._getCalendarElements(cardElement);
		const {
			dueCustomDateButton,
			dueTodayButton,
			dueTomorrowButton,
			dueDateContainer,
		} = elements;

		const allDueButtons = [
			dueTodayButton,
			dueTomorrowButton,
			dueCustomDateButton,
		];

		// Helper functions
		const clearAllSelectedStates = () => {
			allDueButtons.forEach((btn) => {
				if (btn === null) return;
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
			noteInstance.updateNote({ dueDate: formattedDate });
		};

		if (!dueDateContainer) return;

		// Clear focus when clicking outside date container
		cardElement.addEventListener(
			'click',
			(event) => {
				if (event.target !== dueDateContainer) {
					this._clearDateButtonFocus(allDueButtons);
				}
			},
			{ signal: controller.signal }
		);

		// Handle date button clicks
		dueDateContainer.addEventListener(
			'click',
			(event) => {
				event.preventDefault();
				event.stopPropagation();

				if (event.target.classList.contains('dueToday')) {
					this._handleTodayClick(
						dueTodayButton,
						clearAllSelectedStates,
						addFocusAndUpdateInstance,
						noteInstance
					);
				} else if (event.target.classList.contains('dueTomorrow')) {
					this._handleTomorrowClick(
						dueTomorrowButton,
						clearAllSelectedStates,
						addFocusAndUpdateInstance,
						noteInstance
					);
				} else if (event.target.closest('.dueCustomDate')) {
					this._handleCustomDateClick(
						dueCustomDateButton,
						cardElement,
						clearAllSelectedStates,
						noteInstance
					);
				}

				Note.create(noteInstance, TaskCardRenderer.category);
			},
			{ signal: controller.signal }
		);
	}

	/**
	 * Attach input field event listeners
	 */
	static attachInputListeners(cardElement, noteInstance, controller) {
		const titleInput = cardElement.querySelector('#newTaskTitle');
		const descriptionInput = cardElement.querySelector('#newTaskDescription');

		if (!cardElement) return;

		const eventHandler = (event) => {
			if (event.target === titleInput) {
				noteInstance.updateNote({ title: titleInput.value });
				this._saveCardData(cardElement, noteInstance);
			} else if (event.target === descriptionInput) {
				noteInstance.updateNote({ description: descriptionInput.value });
				this._saveCardData(cardElement, noteInstance);
			}
		};

		cardElement.addEventListener('input', eventHandler, {
			signal: controller.signal,
		});
	}

	/**
	 * Attach three-dot menu visibility listeners
	 * TODO: Implement actual menu functionality
	 * TODO: Attach only to newTaskCard, for taskCard... attach it normally
	 */
	static attachThreeDotMenuListeners(cardElement, noteInstance, controller) {
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
			{ signal: controller.signal }
		);
	}

	/**
	 * Attach listeners for removing empty new cards
	 */
	static attachRemoveNewCardListeners(cardElement, noteInstance, controller) {
		if (!cardElement) return;

		const titleInput = cardElement.querySelector('#newTaskTitle');
		const descriptionInput = cardElement.querySelector('#newTaskDescription');

		const handleClickOutside = (event) => {
			if (!cardElement.contains(event.target)) {
				if (!titleInput.value.trim() && !descriptionInput.value.trim()) {
					controller.abort();
					cardElement.remove();
					if (Note.get(noteInstance.id)) {
						Note.delete(noteInstance.id);
						Category.removeNote(noteInstance.id, 'default');
					}
				}
			}
		};

		document.addEventListener('click', handleClickOutside, {
			signal: controller.signal,
		});
	}

	/**
	 * Attach listeners for transitioning cards to display mode
	 * TODO: Implement actual transition logic instead of creating a new card
	 */
	static attachCardTransitionListeners(cardElement, noteInstance, controller) {
		const container = document.querySelector('.cardDisplayContainer');

		function transitionToDisplayMode(event) {
			if (!cardElement.contains(event.target) && Note.get(noteInstance.id)) {
				cardElement.remove();
				if (cardElement._abortController) {
					cardElement._abortController.abort();
					delete cardElement._abortController;
				}
				controller.abort();

				const card =
					CardTemplateManager.createDisplayCardTemplate(noteInstance);
				if (container && card) {
					container.insertAdjacentHTML('afterbegin', card);
				}
			}
		}

		document.addEventListener('click', transitionToDisplayMode, {
			signal: controller.signal,
		});

		// Cleanup observer
		const observer = new MutationObserver(() => {
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

	// Private helper methods
	static _getCalendarElements(cardElement) {
		return {
			dueCustomDateButton: cardElement.querySelector('.dueCustomDate'),
			dueTodayButton: cardElement.querySelector('.dueToday'),
			dueTomorrowButton: cardElement.querySelector('.dueTomorrow'),
			dueDateContainer: cardElement.querySelector('.dueDateContainer'),
		};
	}

	static _clearDateButtonFocus(buttons) {
		buttons.forEach((button) => {
			if (button) {
				// button.classList.remove('bg-generic-btn-focus', 'border-gray-500');
				button.classList.remove('bg-generic-btn-focus');
				// button.classList.add('border-transparent');
			}
		});
	}

	static _handleTodayClick(
		dueTodayButton,
		clearAllSelectedStates,
		addFocusAndUpdateInstance,
		noteInstance
	) {
		if (dueTodayButton.classList.contains('bg-generic-btn-focus')) {
			clearAllSelectedStates();
			noteInstance.updateNote({ dueDate: '' });
			Note.create(noteInstance, TaskCardRenderer.category);
			return;
		}
		const today = new Date();
		const formattedDate = today.toISOString().split('T')[0];
		clearAllSelectedStates();
		addFocusAndUpdateInstance(dueTodayButton, formattedDate);
	}

	static _handleTomorrowClick(
		dueTomorrowButton,
		clearAllSelectedStates,
		addFocusAndUpdateInstance,
		noteInstance
	) {
		if (dueTomorrowButton.classList.contains('bg-generic-btn-focus')) {
			clearAllSelectedStates();
			noteInstance.updateNote({ dueDate: '' });
			Note.create(noteInstance, TaskCardRenderer.category);
			return;
		}
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		const formattedDate = tomorrow.toISOString().split('T')[0];
		clearAllSelectedStates();
		addFocusAndUpdateInstance(dueTomorrowButton, formattedDate);
	}

	static _handleCustomDateClick(
		dueCustomDateButton,
		cardElement,
		clearAllSelectedStates,
		noteInstance
	) {
		if (
			dueCustomDateButton.textContent === '' ||
			!dueCustomDateButton.classList.contains('bg-generic-btn-focus')
		) {
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

		dateInput.style.top = `${buttonRect.bottom + 5}px`;
		dateInput.style.left = `${buttonRect.left - 7}px`;

		const fp = flatpickr(dateInput, {
			dateFormat: 'Y-m-d',
			onChange: (selectedDates, dateStr) => {
				noteInstance.updateNote({ dueDate: dateStr });
				dueCustomDateButton.textContent = dateStr;
				Note.create(noteInstance, TaskCardRenderer.category);
			},
		});
		fp.open();
	}

	static _saveCardData(cardElement, noteInstance) {
		const titleInput = cardElement.querySelector('#newTaskTitle');
		const descriptionInput = cardElement.querySelector('#newTaskDescription');

		if (titleInput.value || descriptionInput.value) {
			noteInstance.updateNote({
				title: titleInput.value,
				description: descriptionInput.value,
			});
			Note.create(noteInstance, TaskCardRenderer.category);
		}
	}
}
