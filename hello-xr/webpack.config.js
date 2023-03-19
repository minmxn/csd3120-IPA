const path = require("path");
const HtmlWebPackPlugin =require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin')
module.exports = {
    entry: './src/main.ts',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: [".ts",".js"]
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },
    mode: "development",
    devtool: 'inline-source-map',
    devServer: {
        static: true,
        port: 3000,
    },
    plugins:[
        new HtmlWebPackPlugin({
            template: path.resolve(__dirname,'src/index.html')
        }),
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'public')}
            ]
        }),

    ]
};