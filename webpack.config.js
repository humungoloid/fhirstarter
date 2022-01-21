const { dirname } = require('path');
const appDir = dirname(require.main.filename);
const path = require('path');
const pkg = require('./package.json');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	target: 'node',
	devtool: 'source-map',
	entry: './src/index.js',
	output: {
		clean: true,
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
		library: pkg.name.split('/')[1],
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin({ exclude: /_[A-Za-z]*.js/ })],
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, '.fhirstarter', 'templates'),
					to: 'templates',
				},
			],
			options: {
				concurrency: 100,
			},
		}),
		new webpack.ProvidePlugin({
			__global: path.resolve(__dirname, 'src', 'utils', 'globals'),
		}),
	],
};
