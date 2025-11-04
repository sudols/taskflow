import React, { useState } from 'react';
import { TaskProvider } from './context/TaskContext';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

const App = () => {
	const [sidebarVisible, setSidebarVisible] = useState(true);

	const toggleSidebar = () => {
		setSidebarVisible(!sidebarVisible);
	};

	return (
		<TaskProvider>
			<div className="flex">
				{/* Menu toggle button */}
				<div
					className="menuOpen absolute p-1.5 hover:bg-generic-btn-hover transition rounded-full z-10 top-5 left-5 cursor-pointer flex justify-center items-center"
					onClick={toggleSidebar}
				>
					<i className="ti ti-menu-2 text-xl"></i>
				</div>

				{/* Sidebar */}
				<Sidebar visible={sidebarVisible} onToggle={toggleSidebar} />

				{/* Main Content */}
				<MainContent sidebarVisible={sidebarVisible} />
			</div>
		</TaskProvider>
	);
};

export default App;
