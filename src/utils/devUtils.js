import Note from '../models/Note.js';
import Category from '../models/Category.js';

/**
 * Development utility for generating sample task data
 */
export default class DevUtils {
	/**
	 * Get all existing categories
	 * @returns {string[]} Array of category names
	 */
	static getCategories() {
		const categories = Category.getAll();
		console.log('📂 Available categories:', categories);
		return categories;
	}

	/**
	 * Delete all categories and their associated notes
	 * @returns {number} Number of notes deleted
	 */
	static deleteAllCategories() {
		console.log('🧹 Clearing all categories and notes...');

		const categories = Category.getStoredCategories();
		let deletedCount = 0;

		// Delete all notes from localStorage
		Object.values(categories).forEach((noteIds) => {
			if (Array.isArray(noteIds)) {
				noteIds.forEach((noteId) => {
					if (localStorage.getItem(noteId)) {
						localStorage.removeItem(noteId);
						deletedCount++;
					}
				});
			}
		});

		// Clear categories index
		localStorage.removeItem('categories_index');

		console.log(`🗑️ Deleted ${deletedCount} notes and all categories`);

		// Clear the UI if container exists
		const container = document.querySelector('.cardDisplayContainer');
		if (container) {
			container.innerHTML = '';
		}

		return deletedCount;
	}

	/**
	 * Generate random tasks in a specific category with varied content
	 * @param {string} categoryName - Name of the category to create tasks in
	 * @param {number} count - Number of tasks to generate (default: 10)
	 * @returns {number} Number of tasks created
	 */
	static generateRandomTasks(categoryName = 'default', count = 10) {
		console.log(
			`🌱 Generating ${count} random tasks in category "${categoryName}"...`
		);

		// Ensure category exists
		if (!Category.exists(categoryName)) {
			Category.create(categoryName);
		}

		const taskTitles = [
			'Complete project documentation',
			'Review pull requests',
			'Buy groceries',
			'Schedule team meeting',
			'Fix navigation bug',
			'Plan weekend trip',
			'Call dentist appointment',
			'Update resume',
			'Learn new framework',
			'Organize workspace',
			'Prepare presentation',
			'Research competitors',
			'Write blog post',
			'Clean house',
			'Exercise routine',
			'Book vacation',
			'Pay monthly bills',
			'Backup important files',
			'Update portfolio',
			'Read technical book',
		];

		const descriptions = [
			'Write comprehensive documentation for the task management app including API docs and user guide',
			'Go through pending PRs and provide feedback to team members',
			'Milk, bread, eggs, vegetables, and fruits for the week',
			'Organize weekly sync meeting with development team',
			'Resolve the issue where menu items are not highlighting correctly on mobile devices',
			'Research destinations, book accommodation, and create itinerary for weekend getaway',
			'Schedule regular dental checkup and cleaning',
			'Update work experience, skills, and education sections',
			'Explore React 18 features and best practices',
			'Declutter desk, organize cables, and clean monitor',
			'Create slides for quarterly review meeting',
			'Analyze market trends and competitor strategies',
			'Write about recent development experiences and learnings',
			'Deep clean kitchen, bathroom, and living areas',
			'Plan weekly workout schedule and meal prep',
			'Compare prices and book summer vacation package',
			'Review and pay utilities, rent, and subscription services',
			'Create backup of projects, photos, and important documents',
			'Add recent projects and update design showcase',
			'Read "Clean Code" and take implementation notes',
		];

		const priorities = ['low', 'normal', 'high'];

		// Task composition patterns (mix of content)
		const patterns = [
			{ hasTitle: true, hasDescription: false, hasDate: false }, // Just title
			{ hasTitle: true, hasDescription: false, hasDate: true }, // Title + date
			{ hasTitle: true, hasDescription: true, hasDate: false }, // Title + description
			{ hasTitle: true, hasDescription: true, hasDate: true }, // Title + description + date
			{ hasTitle: false, hasDescription: true, hasDate: false }, // Just description
			{ hasTitle: false, hasDescription: true, hasDate: true }, // Description + date
		];

		for (let i = 0; i < count; i++) {
			const pattern = patterns[Math.floor(Math.random() * patterns.length)];
			const priority =
				priorities[Math.floor(Math.random() * priorities.length)];
			const isCompleted = Math.random() > 0.85; // 15% chance of being completed

			// Generate content based on pattern
			const titleIndex = Math.floor(Math.random() * taskTitles.length);
			const descIndex = Math.floor(Math.random() * descriptions.length);

			const noteId = crypto.randomUUID();
			const noteObj = {
				id: noteId,
				title: pattern.hasTitle ? taskTitles[titleIndex] : '',
				description: pattern.hasDescription ? descriptions[descIndex] : '',
				dueDate: pattern.hasDate
					? this.getFormattedDate(Math.floor(Math.random() * 14))
					: '', // Random date within 2 weeks
				priority: priority,
				created: new Date(Date.now() - i * 30 * 60 * 1000).toISOString(), // Stagger creation times
				modified: new Date().toISOString(),
				completed: isCompleted,
			};

			// Create note instance and save to category
			const note = new Note(noteObj);
			Note.create(note, categoryName);

			const contentInfo = [];
			if (pattern.hasTitle) contentInfo.push('title');
			if (pattern.hasDescription) contentInfo.push('description');
			if (pattern.hasDate) contentInfo.push('date');

			console.log(`✅ Created task with: ${contentInfo.join(' + ')}`);
		}

		console.log(
			`🎉 Successfully generated ${count} random tasks in "${categoryName}"!`
		);

		// Re-render the cards if TaskCardRenderer is available
		if (typeof window !== 'undefined' && window.TaskCardRenderer) {
			window.TaskCardRenderer.renderCards(categoryName);
		}

		return count;
	}

	/**
	 * Helper method to get formatted date with offset
	 * @param {number} daysOffset - Number of days to offset from today
	 * @returns {string} Formatted date string (YYYY-MM-DD)
	 */
	static getFormattedDate(daysOffset = 0) {
		const date = new Date();
		date.setDate(date.getDate() + daysOffset);
		return date.toISOString().split('T')[0];
	}

	/**
	 * Legacy method for backward compatibility
	 * @deprecated Use generateRandomTasks('default', count) instead
	 */
	static generateSampleTasks() {
		console.log(
			'⚠️ generateSampleTasks() is deprecated. Use generateRandomTasks() instead.'
		);
		return this.generateRandomTasks('default', 6);
	}

	/**
	 * Legacy method for backward compatibility
	 * @deprecated Use generateRandomTasks('default', count) instead
	 */
	static generateBulkTasks(count = 20) {
		console.log(
			'⚠️ generateBulkTasks() is deprecated. Use generateRandomTasks() instead.'
		);
		return this.generateRandomTasks('default', count);
	}

	/**
	 * Legacy method for backward compatibility
	 * @deprecated Use deleteAllCategories() instead
	 */
	static clearAllTasks() {
		console.log(
			'⚠️ clearAllTasks() is deprecated. Use deleteAllCategories() instead.'
		);
		return this.deleteAllCategories();
	}
}
