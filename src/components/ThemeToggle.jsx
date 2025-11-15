import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
	const [isDark, setIsDark] = useState(true);

	useEffect(() => {
		// Check localStorage or default to dark
		const savedTheme = localStorage.getItem('theme');
		const prefersDark = savedTheme === 'dark' || !savedTheme;
		setIsDark(prefersDark);

		if (prefersDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, []);

	const toggleTheme = () => {
		const newTheme = !isDark;
		setIsDark(newTheme);

		if (newTheme) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	};

	return (
		<button
			onClick={toggleTheme}
			className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-generic-btn-hover transition"
			title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
		>
			{isDark ? (
				<>
					<i className="ti ti-sun text-xl"></i>
					<span className="text-sm">Light</span>
				</>
			) : (
				<>
					<i className="ti ti-moon text-xl"></i>
					<span className="text-sm">Dark</span>
				</>
			)}
		</button>
	);
};

export default ThemeToggle;
