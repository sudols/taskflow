import React, { useRef, useEffect, useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import flatpickr from 'flatpickr';

const TaskCard = ({ task }) => {
	const { updateTask, toggleTask } = useTaskContext();
	const [isExpanded, setIsExpanded] = useState(false);
	const dateButtonRef = useRef(null);
	const flatpickrRef = useRef(null);
	const titleInputRef = useRef(null);
	const descriptionInputRef = useRef(null);
	const cardRef = useRef(null);

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
			}
		};

		if (isExpanded) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isExpanded]);

	const handleCardClick = (e) => {
		// Don't expand if clicking checkbox
		if (e.target.closest('.taskCheckbox')) {
			return;
		}
		setIsExpanded(true);
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

	return (
		<div
			ref={cardRef}
			className="flex items-center gap-4 bg-task-card-bg p-4 rounded-lg taskCard transition"
			data-note-id={task.id}
			onClick={handleCardClick}
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
						task.title || isExpanded ? 'visible' : 'hidden'
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
					<button
						type="button"
						className="cursor-pointer hover:bg-generic-btn-hover hover:rounded hidden threeDotMenu transition"
					>
						<i className="ti ti-dots-vertical"></i>
					</button>
				</div>
				<div
					className={`descriptionContainer ${
						task.description || isExpanded ? 'visible' : 'hidden'
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
						task.dueDate !== '' || isExpanded ? 'visible' : 'hidden'
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
		</div>
	);
};

export default TaskCard;
