import React, { useRef, useEffect, useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import flatpickr from 'flatpickr';

const TaskCard = ({ task }) => {
	const { updateTask, toggleTask, deleteTask } = useTaskContext();
	const [isExpanded, setIsExpanded] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const dateButtonRef = useRef(null);
	const flatpickrRef = useRef(null);
	const titleInputRef = useRef(null);
	const descriptionInputRef = useRef(null);
	const cardRef = useRef(null);
	const menuRef = useRef(null);

	useEffect(() => {
		// Initialize flatpickr on the date button
		if (dateButtonRef.current && !flatpickrRef.current) {
			flatpickrRef.current = flatpickr(dateButtonRef.current, {
				enableTime: false,
				dateFormat: 'Y-m-d',
				defaultDate: task.dueDate || null,
				onChange: (selectedDates, dateStr) => {
					updateTask(task.id, { dueDate: dateStr });
				},
			});
		}

		return () => {
			if (flatpickrRef.current) {
				flatpickrRef.current.destroy();
				flatpickrRef.current = null;
			}
		};
	}, [task.id]);

	// Handle click outside to collapse
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (cardRef.current && !cardRef.current.contains(event.target)) {
				setIsExpanded(false);
				setShowMenu(false); // Close menu when clicking outside
			}
		};

		if (isExpanded) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isExpanded]);

	// Close menu when card is no longer expanded
	useEffect(() => {
		if (!isExpanded) {
			setShowMenu(false);
		}
	}, [isExpanded]);

	const handleCardClick = (e) => {
		// Don't expand if clicking checkbox
		if (e.target.closest('.taskCheckbox')) {
			return;
		}
		setIsExpanded(true);
		setShowMenu(false); // Close menu when card is clicked to expand
	};

	const handleCheckboxToggle = () => {
		toggleTask(task.id);
	};

	const handleTitleChange = (e) => {
		updateTask(task.id, { title: e.target.value });
	};

	const handleDescriptionChange = (e) => {
		updateTask(task.id, { description: e.target.value });
	};

	const handleDeleteTask = (e) => {
		e.stopPropagation();
		deleteTask(task.id);
		setShowMenu(false);
	};

	const toggleMenu = (e) => {
		e.stopPropagation();
		setShowMenu(!showMenu);
	};

	const handleMouseEnter = () => {
		// Close menu when re-hovering the card
		if (!isExpanded) {
			setShowMenu(false);
		}
	};

	return (
		<div
			ref={cardRef}
			className={`flex items-center gap-4 bg-task-card-bg p-4 rounded-lg taskCard transition-all relative group ${
				isExpanded ? 'expanded' : ''
			}`}
			data-note-id={task.id}
			onClick={handleCardClick}
			onMouseEnter={handleMouseEnter}
		>
			<div>
				<label className="flex items-center justify-center cursor-pointer relative taskCheckbox">
					<input
						type="checkbox"
						className="peer h-5 w-5 cursor-pointer appearance-none rounded border bg-sort-btn-bg border-checkbox-border checked:bg-checkbox-checked checked:border-0 transition"
						id="taskCheckbox"
						checked={task.completed}
						onChange={handleCheckboxToggle}
					/>
					<span className="absolute text-checkbox-icon opacity-0 peer-checked:opacity-100 transition">
						<i className="ti ti-check"></i>
					</span>
				</label>
			</div>
			<div className="w-full flex flex-col gap-2">
				<div
					className={`flex items-center justify-between titleContainer ${
						task.title || isExpanded ? 'visible animate-in' : 'hidden'
					}`}
				>
					<input
						ref={titleInputRef}
						type="text"
						name="newTaskTitle"
						id="newTaskTitle"
						placeholder="Title"
						value={task.title || ''}
						onChange={handleTitleChange}
						className={`outline-none text-heading text-lg font-semibold w-full ${
							task.completed ? 'line-through' : ''
						}`}
					/>
				</div>
				<div
					className={`descriptionContainer ${
						task.description || isExpanded ? 'visible animate-in' : 'hidden'
					} flex flex-col w-full`}
				>
					<input
						ref={descriptionInputRef}
						type="text"
						name="newTaskDescription"
						id="newTaskDescription"
						className="outline-none text-body text-sm line-clamp-2"
						placeholder="details"
						value={task.description || ''}
						onChange={handleDescriptionChange}
					/>
				</div>
				<div
					className={`dueDateParentContainer ${
						task.dueDate !== '' || isExpanded ? 'visible animate-in' : 'hidden'
					}`}
				>
					<p className="text-body text-xs flex items-center gap-2 dueDateContainer">
						<button
							ref={dateButtonRef}
							className="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 border border-transparent dueCustomDate transition calendarButton"
							type="button"
						>
							{task.dueDate === '' ? (
								<i className="ti ti-calendar-event"></i>
							) : (
								task.dueDate
							)}
						</button>
					</p>
				</div>
			</div>
			{/* Three-dot menu in top-right corner */}
			<div
				className={`absolute top-2 right-2 ${
					isExpanded ? 'block' : 'opacity-0 group-hover:opacity-100'
				} transition-opacity`}
			>
				<button
					type="button"
					onClick={toggleMenu}
					className="cursor-pointer hover:bg-generic-btn-hover rounded p-1 transition"
				>
					<i className="ti ti-dots-vertical"></i>
				</button>
				{showMenu && (
					<div
						ref={menuRef}
						className="absolute right-0 mt-1 w-32 bg-task-card-bg border border-divider rounded-md shadow-lg z-50"
					>
						<button
							onClick={handleDeleteTask}
							className="w-full text-left px-4 py-2 text-sm text-body hover:bg-sort-btn-bg transition rounded-md"
						>
							Delete
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default TaskCard;
