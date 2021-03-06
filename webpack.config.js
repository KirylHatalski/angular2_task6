var webpack = require('./node_modules/webpack');
var path = require('path');
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports =  {
  context: path.join(__dirname, '/app'),
	entry: {
    index: './main.ts'
  },
	output: {
    path: path.join(__dirname + '/desc'),
    filename: "[name].js"
	},
  module: {
    loaders:[
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract("style-loader","css-loader!stylus-loader?resolve url")
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      },
      {
				test: /\.(eot|woff|ttf|svg|png|jpg)$/,
				loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
			}
    ]
  },
  plugins: [
    new LiveReloadPlugin({
      appendScriptTag: true
    }),
    new ExtractTextPlugin('style.css', {
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'body',
    })
  ],
  resolve: {
    extensions: ['', '.js', '.ts'],
    modulesDirectories: ['node_modules'],
    // root: path.resolve('.', 'desc')
  },
  resolveLoader: {
    modulesDirectories: ['node_modules'],
    moduleTemplates: ['' ,'*-loader', '*'],
    extensions: ['', '.js', '.ts']
  },
  devServer: {
    contentBase: "desc/",
    hot: true
  }
}
