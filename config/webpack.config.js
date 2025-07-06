const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	context: path.resolve(__dirname, '..'), // Set context to root
	entry: './src/main.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, '../dist'),
		clean: true, // Clean dist folder on build
	},
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	devtool: 'inline-source-map', // Better debugging
	devServer: {
		static: '../dist',
		hot: true, // Enable HMR
		open: true, // Open browser on start
		// watchFiles: ['index.html'], // Watch for HTML changes
		watchFiles: [path.resolve(__dirname, '../index.html')],
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								config: path.resolve(__dirname, 'postcss.config.js'),
							},
						},
					},
				], // Import CSS in JS with PostCSS
				include: path.resolve(__dirname, '../src'),
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
				include: /node_modules/,
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			// template: './index.html',
			template: path.resolve(__dirname, '../index.html'),
			filename: 'index.html',
		}),
	],
};
