import Note from '../models/Note.js';
import CardManager from './CardManager.js';
import CardEventManager from './CardEventManager.js';

// utility for random notes generation
import DevUtils from '../utils/devUtils.js';
import Category from '../models/Category.js';

/**
 * TaskCardRenderer - Main orchestrator for task card functionality
 * This class coordinates between CardManager and CardEventManager
 */
export default class TaskCardRenderer {
	static category = 'default';
	/**
	 * Create a new editable task card
	 */
	static createNewCardTemplate() {
		return CardManager.createNewCard();
	}

	/**
	 * Attach calendar/date picker listeners to a card
	 */
	static handleCalendarClick(cardElement, noteInstance, controller, event) {
		if (event.target.closest('.calendarButton')) {
			return CardEventManager.handleCalendarClick(
				cardElement,
				noteInstance,
				controller,
				event
			);
		}
	}

	/**
	 * Attach input field listeners to a card
	 */
	static handleInputClick(cardElement, noteInstance, controller, event) {
		if (
			event.target.closest('#newTaskTitle') ||
			event.target.closest('#newTaskDescription')
		) {
			return CardEventManager.attachInputListeners(
				cardElement,
				noteInstance,
				controller
			);
		}
	}

	/**
	 * Attach listeners for removing empty new cards
	 */
	static attachRemoveNewCardTemplate(cardElement, noteInstance, controller) {
		return CardEventManager.attachRemoveNewCardListeners(
			cardElement,
			noteInstance,
			controller
		);
	}

	/**
	 * Attach three-dot menu listeners to a card
	 */
	static attachThreeDotMenuListeners(cardElement, noteInstance, controller) {
		return CardEventManager.attachThreeDotMenuListeners(
			cardElement,
			noteInstance,
			controller
		);
	}

	/**
	 * Attach listeners for transitioning cards to display container
	 */
	static attachPushToRenderContainerListeners(
		cardElement,
		noteInstance,
		controller
	) {
		return CardEventManager.attachCardTransitionListeners(
			cardElement,
			noteInstance,
			controller
		);
	}

	/**
	 * Save card data to storage
	 */
	static SaveCardData(cardElement, noteInstance) {
		const titleInput = cardElement.querySelector('#newTaskTitle');
		const descriptionInput = cardElement.querySelector('#newTaskDescription');

		if (titleInput.value || descriptionInput.value) {
			noteInstance.update({
				title: titleInput.value,
				description: descriptionInput.value,
			});
			Note.create(noteInstance, this.category);
		}
	}

	/**
	 * Create a display card from a note instance
	 */
	static createCard(noteInstance) {
		return CardManager.createDisplayCard(noteInstance);
	}

	/**
	 * Render all cards for a category
	 */
	static renderCards() {
		return CardManager.renderCards(this.category);
	}

	/**
	 * Update an existing card
	 */
	static updateCard(noteId) {
		return CardManager.updateCard(noteId);
	}

	/**
	 * Attach destroy listeners for cleaning up card state
	 */
	static attachDestroyListeners(cardElement, noteInstance, controller) {
		document.addEventListener(
			'click',
			(event) => {
				if (!cardElement.contains(event.target)) {
					CardManager.transitionToDisplayMode(cardElement, noteInstance);
				}
			},
			{ signal: controller.signal }
		);
	}

	static handleCheckboxToggle(cardElement, noteInstance, controller, event) {
		CardEventManager.handleCheckboxToggle(
			cardElement,
			noteInstance,
			controller
		);
		return true;
	}

	/**
	 * Expand a card to show all fields
	 */
	static expandCard(cardElement, noteInstance, controller, event) {
		return CardManager.expandCard(cardElement, event);
	}

	/**
	 * Initialize global event listeners for the task card system
	 */
	static initializeEventListeners() {
		document.addEventListener(
			'click',
			(event) => {
				// if (event.target.closest('#taskCheckbox')) {
				// 	console.log('yes');

				// 	const cardElement = event.target.closest('.taskCard');
				// 	const noteId = cardElement.dataset.noteId;
				// 	const noteInstance = Note.get(noteId);
				// 	const controller = null;
				// 	event.stopPropagation();
				// 	return;
				// }

				// Handle new task button clicks
				if (event.target.classList.contains('newTaskButton')) {
					const result = TaskCardRenderer.createNewCardTemplate();
					if (!result) return;

					const { cardElement, noteInstance, controller } = result;

					// Attach all necessary event listeners
					TaskCardRenderer.handleInputClick(
						cardElement,
						noteInstance,
						controller
					);
					TaskCardRenderer.handleCalendarClick(
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

				// Handle existing task card clicks
				if (
					event.target.closest('.taskCard') &&
					!event.target.closest('#taskCheckbox')
				) {
					const cardElement = event.target.closest('.taskCard');
					const noteId = cardElement.dataset.noteId;

					// Cleanup existing controller
					if (cardElement._abortController) {
						cardElement._abortController.abort();
						delete cardElement._abortController;
					}

					// Create new controller
					const controller = new AbortController();
					cardElement._abortController = controller;

					if (noteId) {
						const noteInstance = Note.get(noteId);
						if (noteInstance) {
							TaskCardRenderer.handleCheckboxToggle(
								cardElement,
								noteInstance,
								controller,
								event
							);

							TaskCardRenderer.handleInputClick(
								cardElement,
								noteInstance,
								controller,
								event
							);
							TaskCardRenderer.handleCalendarClick(
								cardElement,
								noteInstance,
								controller,
								event
							);

							// TaskCardRenderer.attachThreeDotMenuListeners(
							// 	cardElement,
							// 	noteInstance,
							// 	controller
							// );

							TaskCardRenderer.attachDestroyListeners(
								cardElement,
								noteInstance,
								controller
							);
							if (event.target.closest('.taskCheckbox')) {
								return;
							}
							TaskCardRenderer.expandCard(
								cardElement,
								noteInstance,
								controller,
								event
							);
						}
					}
				}
			},
			{ signal: this.globalController.signal }
		);
	}

	/**
	 * Initialize the TaskCardRenderer system
	 */
	static globalController = new AbortController();
	static init(categoryName) {
		this.category = categoryName;
		Category.exists(categoryName) || Category.create(categoryName);
		this.renderCards();
		if (this.globalController) {
			this.globalController.abort();
			delete this.globalController;
		}
		this.globalController = new AbortController();
		this.initializeEventListeners();
	}
}

// Initialize the system

// Expose DevUtils for development/debugging
if (typeof window !== 'undefined') {
	window.DevUtils = DevUtils;

	// New primary functions
	window.getCategories = () => DevUtils.getCategories();
	window.deleteAllCategories = () => DevUtils.deleteAllCategories();
	window.generateRandomTasks = (categoryName, count) =>
		DevUtils.generateRandomTasks(categoryName, count);
}
