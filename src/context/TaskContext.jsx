import React, { createContext, useContext, useState, useEffect } from 'react';
import Category from '../models/Category';
import Note from '../models/Note';

const TaskContext = createContext();

export const useTaskContext = () => {
	const context = useContext(TaskContext);
	if (!context) {
		throw new Error('useTaskContext must be used within a TaskProvider');
	}
	return context;
};

export const TaskProvider = ({ children }) => {
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [tasks, setTasks] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');

	// Load categories on mount and set default
	useEffect(() => {
		const allCategories = Category.getAll();

		if (allCategories.length === 0) {
			// No categories exist, create "Notes" as default
			Category.create('Notes');
			setCategories(['Notes']);
			setSelectedCategory('Notes');
		} else {
			// Categories exist, select the first one
			setCategories(allCategories);
			setSelectedCategory(allCategories[0]);
		}
	}, []);

	// Load tasks when selected category changes
	useEffect(() => {
		if (selectedCategory) {
			loadTasks(selectedCategory);
		}
	}, [selectedCategory]);

	const loadCategories = () => {
		const allCategories = Category.getAll();
		setCategories(allCategories);
	};

	const loadTasks = (categoryName) => {
		const noteIds = Category.getNotes(categoryName);
		const loadedTasks = noteIds
			.map((id) => Note.get(id))
			.filter((note) => note !== null);
		setTasks(loadedTasks);
	};

	const createCategory = (categoryName) => {
		if (categoryName && categoryName.trim()) {
			Category.create(categoryName.trim());
			loadCategories();
		}
	};

	const deleteCategory = (categoryName) => {
		Category.delete(categoryName);
		loadCategories();
		if (selectedCategory === categoryName) {
			setSelectedCategory('default');
		}
	};

	const createTask = (taskData) => {
		const newNote = new Note(taskData);
		Note.create(newNote, selectedCategory);
		loadTasks(selectedCategory);
		return newNote;
	};

	const updateTask = (noteId, updates) => {
		const note = Note.get(noteId);
		if (note) {
			note.update(updates);
			Note.create(note, selectedCategory);
			loadTasks(selectedCategory);
		}
	};

	const deleteTask = (noteId) => {
		Note.delete(noteId);
		Category.removeNote(noteId, selectedCategory);
		loadTasks(selectedCategory);
	};

	const toggleTask = (noteId) => {
		const note = Note.get(noteId);
		if (note) {
			note.toggle();
			loadTasks(selectedCategory);
		}
	};

	const changeCategory = (categoryName) => {
		setSelectedCategory(categoryName);
	};

	const getFilteredTasks = () => {
		if (!searchQuery) return tasks;

		const query = searchQuery.toLowerCase();
		return tasks.filter(
			(task) =>
				task.title.toLowerCase().includes(query) ||
				task.description.toLowerCase().includes(query)
		);
	};

	const value = {
		categories,
		selectedCategory,
		tasks,
		searchQuery,
		setSearchQuery,
		loadCategories,
		createCategory,
		deleteCategory,
		createTask,
		updateTask,
		deleteTask,
		toggleTask,
		changeCategory,
		getFilteredTasks,
	};

	return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
