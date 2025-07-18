import Note from '../models/Note.js';
import Category from '../models/Category.js';
import CardTemplateManager from './CardTemplateManager.js';

/**
 * CardManager - Handles card creation, rendering, and lifecycle management
 */
export default class CardManager {
	/**
	 * Create a new editable card and insert it into the container
	 */
	static createNewCard() {
		const container = document.querySelector('.incompleteCardDisplayContainer');
		if (!container) {
			console.error('Card display container not found');
			return null;
		}

		// Remove existing new card if present
		if (container.innerHTML.includes('newCardContainer')) {
			const existingCard = container.querySelector('.newCardContainer');
			if (existingCard && existingCard._abortController) {
				existingCard._abortController.abort();
			}
			existingCard?.remove();
		}

		// Create controller for event management
		const controller = new AbortController();

		// Insert new card template
		const cardTemplate = CardTemplateManager.createNewCardTemplate();
		container.insertAdjacentHTML('afterbegin', cardTemplate);

		const newCardElement = container.querySelector('.newCardContainer');
		if (!newCardElement) {
			console.error('Failed to create new card element');
			return null;
		}

		// Create note instance
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

		// Attach data and controller to element
		newCardElement.dataset.noteId = newNoteInstance.id;
		newCardElement._abortController = controller;

		return {
			cardElement: newCardElement,
			noteInstance: newNoteInstance,
			controller: controller,
		};
	}

	/**
	 * Create a display card from a note instance
	 */
	static createDisplayCard(noteInstance) {
		const container = document.querySelector('.incompleteCardDisplayContainer');
		if (!container) {
			console.error('Card display container not found');
			return null;
		}

		return CardTemplateManager.createDisplayCardTemplate(noteInstance);
	}

	/**
	 * Render all cards for a specific category
	 */
	static renderCards(categoryName) {
		const notes = Category.getNotes(categoryName);
		// const container = document.querySelector('.cardDisplayContainer');
		const incompleteTasksContainer = document.querySelector(
			'.incompleteCardDisplayContainer'
		);
		const completedTasksContainer = document.querySelector(
			'.completedCardDisplayContainer'
		);

		if (!incompleteTasksContainer || !completedTasksContainer) {
			console.error('Card display container not found');
			return;
		}

		// Clear existing cards
		completedTasksContainer.innerHTML = '';
		incompleteTasksContainer.innerHTML = '';

		// Render each note
		notes.forEach((noteId) => {
			if (noteId === 'not found') return; // Skip invalid entries

			const noteData = Note.get(noteId);
			if (noteData) {
				const cardHTML = this.createDisplayCard(noteData);
				if (cardHTML) {
					if (noteData.completed) {
						completedTasksContainer.insertAdjacentHTML('afterbegin', cardHTML);
					} else {
						incompleteTasksContainer.insertAdjacentHTML('afterbegin', cardHTML);
					}
				}
			}
		});
	}

	/**
	 * Update an existing card with new data
	 */
	static updateCard(noteId) {
		const cardElement = document.querySelector(`[data-note-id="${noteId}"]`);
		const noteData = Note.get(noteId);

		if (!cardElement || !noteData) {
			console.error(`Card or note data not found for ID: ${noteId}`);
			return;
		}

		// Update card content
		const elements = CardTemplateManager.getCardElements(cardElement);

		if (elements.titleInput) {
			elements.titleInput.value = noteData.title || '';
		}

		if (elements.descriptionInput) {
			elements.descriptionInput.value = noteData.description || '';
		}

		// Update visibility of containers
		this._updateCardVisibility(cardElement, noteData);

		// Update due date display
		this._updateDueDateDisplay(cardElement, noteData);
	}

	/**
	 * Remove a card from the DOM and storage
	 */
	static removeCard(noteId, categoryName = 'default') {
		const cardElement = document.querySelector(`[data-note-id="${noteId}"]`);

		if (cardElement) {
			// Cleanup event listeners
			if (cardElement._abortController) {
				cardElement._abortController.abort();
				delete cardElement._abortController;
			}

			// Remove from DOM
			cardElement.remove();
		}

		// Remove from storage
		Note.delete(noteId);
		Category.removeNote(noteId, categoryName);
	}

	/**
	 * Expand a card to show all fields (edit mode)
	 */
	static expandCard(cardElement) {
		if (!cardElement) return;

		const titleContainer = cardElement.querySelector('.titleContainer');
		const descriptionContainer = cardElement.querySelector(
			'.descriptionContainer'
		);
		const dueDateContainer = cardElement.querySelector(
			'.dueDateParentContainer'
		);

		titleContainer?.classList.remove('hidden');
		descriptionContainer?.classList.remove('hidden');
		dueDateContainer?.classList.remove('hidden');
	}

	/**
	 * Collapse a card to show only filled fields (view mode)
	 */
	static collapseCard(cardElement, noteInstance) {
		if (!cardElement || !noteInstance) return;

		this._updateCardVisibility(cardElement, noteInstance);
	}

	/**
	 * Transition a card from edit mode to display mode
	 * ?TODO: Implement actual transition logic instead of creating a new card
	 */
	static transitionToDisplayMode(cardElement, noteInstance) {
		if (!cardElement || !noteInstance) return;

		const displayCardHTML = this.createDisplayCard(noteInstance);
		if (displayCardHTML) {
			cardElement.replaceWith(
				document.createRange().createContextualFragment(displayCardHTML)
			);
		}
	}

	// Private helper methods
	static _updateCardVisibility(cardElement, noteData) {
		const titleContainer = cardElement.querySelector('.titleContainer');
		const descriptionContainer = cardElement.querySelector(
			'.descriptionContainer'
		);
		const dueDateContainer = cardElement.querySelector(
			'.dueDateParentContainer'
		);

		// Show/hide title container
		if (titleContainer) {
			titleContainer.classList.toggle('hidden', !noteData.title);
		}

		// Show/hide description container
		if (descriptionContainer) {
			descriptionContainer.classList.toggle('hidden', !noteData.description);
		}

		// Show/hide due date container
		if (dueDateContainer) {
			dueDateContainer.classList.toggle('hidden', !noteData.dueDate);
		}
	}

	static _updateDueDateDisplay(cardElement, noteData) {
		const dueDateButton = cardElement.querySelector('.dueCustomDate');
		if (dueDateButton) {
			dueDateButton.innerHTML = noteData.dueDate
				? noteData.dueDate
				: '<i class="ti ti-calendar-event"></i>';
		}
	}
}
