import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTaskContext } from '../context/TaskContext';
import flatpickr from 'flatpickr';

const NewTaskCard = ({ onCancel }) => {
	const { createTask } = useTaskContext();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [dueDate, setDueDate] = useState('');
	const customDateButtonRef = useRef(null);
	const flatpickrRef = useRef(null);
	const cardRef = useRef(null);

	const handleSave = useCallback(() => {
		if (title.trim() || description.trim()) {
			const taskData = {
				title: title.trim(),
				description: description.trim(),
				dueDate: dueDate,
				priority: 'normal',
				completed: false,
			};
			createTask(taskData);
		}
		onCancel();
	}, [title, description, dueDate, createTask, onCancel]);

	useEffect(() => {
		// Initialize flatpickr on custom date button
		if (customDateButtonRef.current && !flatpickrRef.current) {
			flatpickrRef.current = flatpickr(customDateButtonRef.current, {
				enableTime: false,
				dateFormat: 'Y-m-d',
				onChange: (selectedDates, dateStr) => {
					setDueDate(dateStr);
				},
			});
		}

		return () => {
			if (flatpickrRef.current) {
				flatpickrRef.current.destroy();
				flatpickrRef.current = null;
			}
		};
	}, []);

	// Handle click outside separately
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (cardRef.current && !cardRef.current.contains(event.target)) {
				handleSave();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [handleSave]);

	const handleToday = () => {
		const today = new Date().toISOString().split('T')[0];
		setDueDate(today);
	};

	const handleTomorrow = () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		setDueDate(tomorrow.toISOString().split('T')[0]);
	};

	return (
		<div
			ref={cardRef}
			className="flex items-center gap-4 bg-task-card-bg p-4 rounded-lg newCardContainer"
		>
			<div>
				<label className="flex items-center justify-center cursor-pointer relative">
					<input
						type="checkbox"
						className="peer h-5 w-5 cursor-pointer appearance-none rounded border bg-sort-btn-bg border-checkbox-border checked:bg-checkbox-checked checked:border-0 transition"
						id="newTaskCheckbox"
						disabled
					/>
					<span className="absolute text-checkbox-icon opacity-0 peer-checked:opacity-100 transition">
						<i className="ti ti-check"></i>
					</span>
				</label>
			</div>
			<div className="w-full flex flex-col gap-2">
				<div>
					<div className="flex items-center justify-between">
						<input
							type="text"
							name="newTaskTitle"
							id="newTaskTitle"
							placeholder="Title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="outline-none text-heading text-lg font-semibold w-full newTaskTitle"
							autoFocus
						/>
						<button
							type="button"
							className="cursor-pointer hover:bg-generic-btn-hover hover:rounded hidden threeDotMenu transition"
						>
							<i className="ti ti-dots-vertical"></i>
						</button>
					</div>
					<input
						type="text"
						name="newTaskDescription"
						id="newTaskDescription"
						className="outline-none text-body text-sm line-clamp-2 newTaskDescription"
						placeholder="details"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>
				<div>
					<p className="text-body text-xs flex items-center gap-2">
						<span className="dueDateContainer">
							<button
								className="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 border border-transparent dueToday transition calendarButton"
								type="button"
								onClick={handleToday}
							>
								Today
							</button>
							<button
								className="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 border border-transparent dueTomorrow transition calendarButton"
								type="button"
								onClick={handleTomorrow}
							>
								Tomorrow
							</button>
							<button
								ref={customDateButtonRef}
								className="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 border border-transparent dueCustomDate transition calendarButton"
								type="button"
							>
								<i className="ti ti-calendar-event"></i>
							</button>
						</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default NewTaskCard;
