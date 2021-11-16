const { merge } = require('webpack-merge');
const base = require('./webpack.base.js');
const path =require("path")
const fs=require("fs")
const fileList=fs.readdirSync(path.resolve(__dirname,"../public"))
const opens=fileList.map(file=>`/${file.split(".").shift()}/${file.split(".").shift()}.html`)
module.exports = merge(base, {
    //开发模式
    mode: 'development',
    devServer: {
        static:{
            directory: path.resolve(__dirname,"../dist"),
        },
        hot: true,
        proxy: {
            "/api2": {
                target: 'https://dev.xiaocaoku.cn',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    "^/api2": ''
                }
            }
        },
        open:opens
    },
    devtool: 'inline-source-map',
});