"use strict";
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const config = {
    entry: {
        vendor: ['react', 'react-dom', 'redux'],
        app: path.resolve(__dirname, 'js', 'index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: 'dist'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [
                    path.resolve(__dirname, "node_modules")
                ],
                use: [{
                    loader: "babel-loader",
                    options: {
                        presets: ["react"]
                    }
                }],
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: "[name].js"
        }),
        new UglifyJsPlugin(),
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            "node_modules",
            path.resolve(__dirname, "src")
        ],
    },
    devtool: "inline-source-map",
    watch: true
};

webpack(config, (err/*, status*/) => {
    const date = new Date();
    const timeString = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    if (err) {
        return console.error(`[${timeString}] - Error: ${err}`);
    }
    console.log(`[${timeString}] - Compiled`);
});