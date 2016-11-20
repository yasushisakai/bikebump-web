var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './src/app/index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    entry: [
        './src/app/index.jsx',
    ],
    output: {
        path: __dirname + '/dist',
        publicPath : '/',
        filename: "index_bundle.js"
    },

    module: {
        loaders: [{
            test: /\.js[x]?$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                presets: ['es2015', 'react']
            }
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    plugins: [HtmlWebpackPluginConfig]
};
