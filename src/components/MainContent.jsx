import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskCard from './TaskCard';
import NewTaskCard from './NewTaskCard';

const MainContent = ({ sidebarVisible }) => {
	const { tasks, searchQuery, setSearchQuery, getFilteredTasks } =
		useTaskContext();
	const [isCreatingTask, setIsCreatingTask] = useState(false);

	const filteredTasks = getFilteredTasks();
	const incompleteTasks = filteredTasks.filter((task) => !task.completed);
	const completedTasks = filteredTasks.filter((task) => task.completed);

	const handleNewTask = () => {
		setIsCreatingTask(true);
	};

	const handleTaskCancelled = () => {
		setIsCreatingTask(false);
	};

	return (
		<main
			className={`mainDisplay w-full h-screen grid grid-cols-2 grid-rows-[60px_50px_1fr] mt-5 mr-20 transition-all ${
				sidebarVisible ? 'ml-80' : 'ml-20'
			}`}
		>
			{/* Search Bar */}
			<div className="col-span-2">
				<form action="#" onSubmit={(e) => e.preventDefault()}>
					<div className="relative">
						<input
							type="search"
							name="card-search"
							id="card-search"
							className="appearance-none outline-none rounded-md bg-header-search-bg focus:text-active-menu text-inactive-menu pl-8 pt-2 pb-2 pr-20 text-sm border-gray-600 border"
							placeholder="Search tasks"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<div className="absolute left-2 top-0 flex items-center justify-center h-full text-base">
							<i className="ti ti-search text-grey-200"></i>
						</div>
					</div>
				</form>
			</div>

			{/* Header with buttons */}
			<div className="row-start-2 flex items-center">
				<div>
					<p className="text-heading text-2xl font-bold">My Tasks</p>
				</div>
			</div>
			<div className="row-start-2 justify-self-end flex gap-3 items-center">
				<button
					type="button"
					className="hover:cursor-pointer bg-btn-bg text-btn-text pt-1.5 pb-1.5 pr-3 pl-3 rounded-md hover:bg-btn-focus font-bold text-sm newTaskButton"
					onClick={handleNewTask}
				>
					New Task
				</button>
				<button
					type="button"
					className="hover:cursor-pointer bg-sort-btn-bg pt-1.5 pb-1.5 pr-3 pl-3 rounded-md text-btn-text font-bold text-sm sortTaskButton"
				>
					Sort & Filter
				</button>
			</div>

			{/* Task Cards Container */}
			<div className="col-span-2 cardDisplayContainer flex flex-col gap-2">
				{/* New Task Card */}
				{isCreatingTask && <NewTaskCard onCancel={handleTaskCancelled} />}

				{/* Incomplete Tasks */}
				<div className="incompleteCardDisplayContainer flex flex-col gap-2">
					{incompleteTasks.map((task) => (
						<TaskCard key={task.id} task={task} />
					))}
				</div>

				{/* Completed Tasks */}
				<div className="completedCardDisplayContainer flex flex-col gap-2">
					{completedTasks.map((task) => (
						<TaskCard key={task.id} task={task} />
					))}
				</div>
			</div>
		</main>
	);
};

export default MainContent;
