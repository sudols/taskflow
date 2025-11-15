import React, { useState, useEffect, useRef } from 'react';

const SortDropdown = ({ sortBy, setSortBy }) => {
	const [showSortMenu, setShowSortMenu] = useState(false);
	const sortMenuRef = useRef(null);

	const handleSortChange = (sortOption) => {
		setSortBy(sortOption);
		setShowSortMenu(false);
	};

	const getSortLabel = () => {
		const labels = {
			creation: 'Sort: Creation Date',
			completion: 'Sort: Completion',
			dueDate: 'Sort: Due Date',
		};
		return labels[sortBy];
	};

	// Close sort menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
				setShowSortMenu(false);
			}
		};

		if (showSortMenu) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showSortMenu]);

	return (
		<div className="relative" ref={sortMenuRef}>
			<button
				type="button"
				onClick={() => setShowSortMenu(!showSortMenu)}
				className="hover:cursor-pointer bg-sort-btn-bg pt-1.5 pb-1.5 pr-8 pl-3 rounded-md text-sort-btn-text font-bold text-sm hover:bg-gray-600 transition flex items-center gap-2"
			>
				{getSortLabel()}
				<svg
					className="w-4 h-4 ml-1"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			</button>
			{showSortMenu && (
				<div className="absolute right-0 mt-1 w-56 bg-task-card-bg border border-divider rounded-md shadow-lg z-10">
					<button
						onClick={() => handleSortChange('creation')}
						className={`w-full text-left px-4 py-2 text-sm hover:bg-sort-btn-bg transition ${
							sortBy === 'creation'
								? 'bg-sort-btn-bg text-sort-btn-text'
								: 'text-body'
						}`}
					>
						Sort by Creation Date
					</button>
					<button
						onClick={() => handleSortChange('completion')}
						className={`w-full text-left px-4 py-2 text-sm hover:bg-sort-btn-bg transition ${
							sortBy === 'completion'
								? 'bg-sort-btn-bg text-sort-btn-text'
								: 'text-body'
						}`}
					>
						Sort by Completion Status
					</button>
					<button
						onClick={() => handleSortChange('dueDate')}
						className={`w-full text-left px-4 py-2 text-sm hover:bg-sort-btn-bg transition ${
							sortBy === 'dueDate'
								? 'bg-sort-btn-bg text-sort-btn-text'
								: 'text-body'
						}`}
					>
						Sort by Due Date
					</button>
				</div>
			)}
		</div>
	);
};

export default SortDropdown;
