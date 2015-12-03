module.exports = {
	entry: './src/app.js',
	output: {
		filename: 'app.js'
	},
	module: {
		loaders: [
			{ test: /\.vue$/, loader: 'vue' },
			{ test: /\.js$/, loader: 'babel', exclude: /node_modules/ }
		]
	},
	babel: {
		presets: ['es2015'],
		plugins: ['transform-runtime']
	}
}
