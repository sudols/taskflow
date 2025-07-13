import Note from '../models/Note.js';
import Category from '../models/Category.js';

/**
 * Development utility for generating sample task data
 */
// console.log('💡 TaskCardRenderer and DevUtils loaded globally');
// console.log('🎯 Available functions:');
// console.log('   - generateSampleTasks() - Generate 6 sample tasks');
// console.log('   - generateBulkTasks(count) - Generate bulk tasks');
// console.log('   - clearAllTasks() - Clear all existing tasks');
// console.log('   - DevUtils.* / TaskCardRenderer.* - Access all methods');
export default class DevUtils {
	static generateSampleTasks() {
		console.log('🌱 Generating sample tasks...');

		// Clear existing data first
		this.clearAllTasks();

		// Sample task data
		const sampleTasks = [
			{
				title: 'Complete project documentation',
				description:
					'Write comprehensive documentation for the task management app including API docs and user guide',
				dueDate: this.getFormattedDate(2), // Due in 2 days
				priority: 'high',
				completed: false,
			},
			{
				title: 'Review pull requests',
				description:
					'Go through pending PRs and provide feedback to team members',
				dueDate: this.getFormattedDate(0), // Due today
				priority: 'normal',
				completed: false,
			},
			{
				title: 'Buy groceries',
				description: 'Milk, bread, eggs, vegetables, and fruits for the week',
				dueDate: this.getFormattedDate(1), // Due tomorrow
				priority: 'normal',
				completed: false,
			},
			{
				title: 'Schedule team meeting',
				description: 'Organize weekly sync meeting with development team',
				dueDate: '', // No due date
				priority: 'low',
				completed: true,
			},
			{
				title: 'Fix navigation bug',
				description:
					'Resolve the issue where menu items are not highlighting correctly on mobile devices',
				dueDate: this.getFormattedDate(3), // Due in 3 days
				priority: 'high',
				completed: false,
			},
			{
				title: 'Plan weekend trip',
				description:
					'Research destinations, book accommodation, and create itinerary for weekend getaway',
				dueDate: this.getFormattedDate(7), // Due in a week
				priority: 'low',
				completed: false,
			},
		];

		// Create category index
		let categoryIndex = { default: [] };

		// Generate tasks
		sampleTasks.forEach((taskData, index) => {
			const noteId = crypto.randomUUID();
			const noteObj = {
				id: noteId,
				title: taskData.title,
				description: taskData.description,
				dueDate: taskData.dueDate,
				priority: taskData.priority,
				created: new Date(Date.now() - index * 60 * 60 * 1000).toISOString(),
				modified: new Date().toISOString(),
				completed: taskData.completed,
			};

			// Store note in localStorage
			localStorage.setItem(noteId, JSON.stringify(noteObj));

			// Add to default category
			categoryIndex.default.push(noteId);

			console.log(`✅ Created task: "${taskData.title}"`);
		});

		// Save category index
		localStorage.setItem('categories_index', JSON.stringify(categoryIndex));

		console.log(
			`🎉 Successfully generated ${sampleTasks.length} sample tasks!`
		);
		console.log('🔄 Re-rendering cards...');

		// Re-render the cards if TaskCardRenderer is available
		if (typeof window !== 'undefined' && window.TaskCardRenderer) {
			window.TaskCardRenderer.renderCards('default');
		}

		return sampleTasks.length;
	}

	static clearAllTasks() {
		console.log('🧹 Clearing all tasks...');

		const categories =
			JSON.parse(localStorage.getItem('categories_index')) || {};
		let deletedCount = 0;

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

		localStorage.removeItem('categories_index');

		console.log(`🗑️ Deleted ${deletedCount} tasks`);

		// Clear the UI if container exists
		const container = document.querySelector('.cardDisplayContainer');
		if (container) {
			container.innerHTML = '';
		}

		return deletedCount;
	}

	static getFormattedDate(daysOffset = 0) {
		const date = new Date();
		date.setDate(date.getDate() + daysOffset);
		return date.toISOString().split('T')[0];
	}

	static generateBulkTasks(count = 20) {
		console.log(`🔄 Generating ${count} bulk tasks for testing...`);

		const taskPrefixes = [
			'Review',
			'Update',
			'Fix',
			'Implement',
			'Design',
			'Test',
			'Deploy',
			'Refactor',
			'Optimize',
			'Debug',
			'Create',
			'Plan',
			'Research',
			'Analyze',
		];

		const taskSubjects = [
			'user interface',
			'database schema',
			'API endpoints',
			'test cases',
			'documentation',
			'deployment pipeline',
			'error handling',
			'performance',
			'security measures',
			'user authentication',
			'data validation',
			'logging system',
			'monitoring tools',
			'backup strategy',
			'code quality',
			'accessibility features',
		];

		const priorities = ['low', 'normal', 'high'];

		// Get existing category index or create new one
		let categoryIndex = JSON.parse(
			localStorage.getItem('categories_index')
		) || { default: [] };

		for (let i = 0; i < count; i++) {
			const prefix =
				taskPrefixes[Math.floor(Math.random() * taskPrefixes.length)];
			const subject =
				taskSubjects[Math.floor(Math.random() * taskSubjects.length)];
			const priority =
				priorities[Math.floor(Math.random() * priorities.length)];
			const hasDueDate = Math.random() > 0.3; // 70% chance of having a due date
			const isCompleted = Math.random() > 0.8; // 20% chance of being completed

			const noteId = crypto.randomUUID();
			const noteObj = {
				id: noteId,
				title: `${prefix} ${subject}`,
				description: `Detailed task to ${prefix.toLowerCase()} ${subject} as part of the development process`,
				dueDate: hasDueDate
					? this.getFormattedDate(Math.floor(Math.random() * 14))
					: '', // Random date within 2 weeks
				priority: priority,
				created: new Date(Date.now() - i * 30 * 60 * 1000).toISOString(), // Stagger creation times by 30 min
				modified: new Date().toISOString(),
				completed: isCompleted,
			};

			// Store note in localStorage
			localStorage.setItem(noteId, JSON.stringify(noteObj));

			// Add to default category
			categoryIndex.default.push(noteId);
		}

		// Save category index
		localStorage.setItem('categories_index', JSON.stringify(categoryIndex));

		console.log(`✨ Generated ${count} additional bulk tasks!`);

		// Re-render the cards if TaskCardRenderer is available
		if (typeof window !== 'undefined' && window.TaskCardRenderer) {
			window.TaskCardRenderer.renderCards('default');
		}

		return count;
	}
}
