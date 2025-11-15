import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

const Sidebar = ({ visible, onToggle }) => {
	const {
		categories,
		selectedCategory,
		changeCategory,
		createCategory,
		deleteCategory,
	} = useTaskContext();
	const [isAddingCategory, setIsAddingCategory] = useState(false);
	const [newCategoryName, setNewCategoryName] = useState('');
	const [menuOpenForCategory, setMenuOpenForCategory] = useState(null);

	const handleAddCategory = () => {
		setIsAddingCategory(true);
	};

	const handleCategorySubmit = () => {
		if (newCategoryName.trim()) {
			createCategory(newCategoryName.trim());
			setNewCategoryName('');
		}
		setIsAddingCategory(false);
	};

	const handleCategoryCancel = () => {
		setNewCategoryName('');
		setIsAddingCategory(false);
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleCategorySubmit();
		} else if (e.key === 'Escape') {
			handleCategoryCancel();
		}
	};

	const handleCategoryClick = (categoryName) => {
		changeCategory(categoryName);
	};

	const handleDeleteCategory = (categoryName, e) => {
		e.stopPropagation();
		if (confirm(`Delete category "${categoryName}"?`)) {
			deleteCategory(categoryName);
			setMenuOpenForCategory(null);
		}
	};

	const toggleMenu = (categoryName, e) => {
		e.stopPropagation();
		setMenuOpenForCategory(
			menuOpenForCategory === categoryName ? null : categoryName
		);
	};

	return (
		<aside
			className={`fixed bg-sidebar-bg pl-5 pr-5 pt-5 min-50 min-h-screen overflow-y-auto flex flex-col sidebar z-100 transition-all ${
				visible ? '' : 'hidden'
			}`}
		>
			<div className="flex items-center justify-around pb-6">
				<div
					className="menuClose w-8 h-8 p-1.5 hover:bg-generic-btn-hover transition rounded-full flex justify-center items-center cursor-pointer"
					onClick={onToggle}
				>
					<i className="ti ti-menu-2 text-xl"></i>
				</div>
				<header className="bg-header-bg flex px-5">
					<div className="flex items-center gap-1">
						<img
							src="./assets/images/taskflow-icon.png"
							alt="TaskFlow Logo"
							className="h-8 w-8"
						/>
						<p>
							<span className="text-logo text-xl font-bold">TaskFlow</span>
						</p>
					</div>
				</header>
			</div>

			<div className="categoryContainer flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<p className="text-gray-500 text-xs">CATEGORIES</p>
					<i
						className="addCategoryButton ti ti-plus cursor-pointer hover:bg-generic-btn-hover transition duration-200 rounded-md p-1"
						onClick={handleAddCategory}
					></i>
				</div>

				<ul className="categoryList flex flex-col gap-2">
					{isAddingCategory && (
						<li className="inline newCategoryLi hover:cursor-pointer hover:bg-generic-btn-hover transition duration-200 rounded-md pt-2 pb-2 pl-4">
							<input
								className="newCategoryInput outline-none bg-transparent border-0 max-w-40 text-inherit font-inherit"
								type="text"
								value={newCategoryName}
								onChange={(e) => setNewCategoryName(e.target.value)}
								onKeyDown={handleKeyPress}
								onBlur={handleCategorySubmit}
								placeholder="Name"
								autoFocus
							/>
						</li>
					)}

					{categories.map((category) => (
						<li
							key={category}
							className={`hover:cursor-pointer hover:bg-generic-btn-hover categoryItem transition duration-200 rounded-md p-2 pl-4 relative group ${
								selectedCategory === category ? 'bg-generic-btn-hover' : ''
							}`}
							onClick={() => handleCategoryClick(category)}
						>
							<div className="flex items-center justify-between">
								<span>{category}</span>
								<div className="relative">
									<i
										className="ti ti-dots-vertical opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1 hover:bg-gray-600 rounded"
										onClick={(e) => toggleMenu(category, e)}
									></i>
									{menuOpenForCategory === category && (
										<div className="absolute right-0 mt-1 w-32 bg-task-card-bg border border-divider rounded-md shadow-lg z-50">
											<button
												onClick={(e) => handleDeleteCategory(category, e)}
												className="w-full text-left px-4 py-2 text-sm text-body hover:bg-sort-btn-bg transition rounded-md"
											>
												Delete
											</button>
										</div>
									)}
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>

			<div className="AboutPage mt-auto w-full flex flex-col mb-5">
				<a href="/pages/about.html">
					<p className="text-gray-500 text-s border-t border-gray-600 pt-3 hover:cursor-pointer hover:text-active-menu transition duration-200 text-center">
						About Project
					</p>
				</a>
			</div>
		</aside>
	);
};

export default Sidebar;
