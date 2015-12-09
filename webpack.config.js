var webpack = require('webpack');

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

if (process.env.NODE_ENV === 'production') {
	module.exports.output.filename = 'app.js',
	module.exports.plugins = [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: "'production'"
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: false,
			compress: {
				warnings: false
			}
		})
	]
} else {
	module.exports.devtool = '#source-map';
}
