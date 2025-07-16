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
	static attachCalendarListeners(cardElement, noteInstance, controller) {
		return CardEventManager.attachCalendarListeners(
			cardElement,
			noteInstance,
			controller
		);
	}

	/**
	 * Attach input field listeners to a card
	 */
	static attachInputListeners(cardElement, noteInstance, controller) {
		return CardEventManager.attachInputListeners(
			cardElement,
			noteInstance,
			controller
		);
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
			noteInstance.updateNote({
				title: titleInput.value,
				description: descriptionInput.value,
			});
			Note.createNote(noteInstance, this.category);
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

	/**
	 * Expand a card to show all fields
	 */
	static expandCard(cardElement, noteInstance, controller) {
		return CardManager.expandCard(cardElement);
	}

	/**
	 * Initialize global event listeners for the task card system
	 */
	static initializeEventListeners() {
		document.addEventListener(
			'click',
			(event) => {
				// Handle new task button clicks
				if (event.target.classList.contains('newTaskButton')) {
					const result = TaskCardRenderer.createNewCardTemplate();
					if (!result) return;

					const { cardElement, noteInstance, controller } = result;

					// Attach all necessary event listeners
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

				// Handle existing task card clicks
				if (event.target.closest('.taskCard')) {
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
						const noteInstance = Note.getNoteData(noteId);
						if (noteInstance) {
							// Attach event listeners for editing mode
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
							TaskCardRenderer.attachThreeDotMenuListeners(
								cardElement,
								noteInstance,
								controller
							);
							TaskCardRenderer.attachDestroyListeners(
								cardElement,
								noteInstance,
								controller
							);
							TaskCardRenderer.expandCard(
								cardElement,
								noteInstance,
								controller
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
		Category.categoryExists(categoryName) ||
			Category.createCategory(categoryName);
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
	window.generateSampleTasks = () => DevUtils.generateSampleTasks();
	window.clearAllTasks = () => DevUtils.clearAllTasks();
	window.generateBulkTasks = (count) => DevUtils.generateBulkTasks(count);
}

// Render cards on page load
// document.addEventListener('DOMContentLoaded', () => {
// 	TaskCardRenderer.renderCards('default');
// });
