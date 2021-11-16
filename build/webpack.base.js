const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const fs = require("fs")
const fileList = fs.readdirSync(path.resolve(__dirname, "../public"))
const HtmlWebpackPluginList = fileList.map(item => {
    const name = item.split(".").shift()
    return new HtmlWebpackPlugin({
        chunks: [name],
        filename: `${name}/${name}.html`,
        template: path.resolve(__dirname, `../public/${name}.html`)
    })
})
const entry = {}
fileList.forEach(file => {
    const name = file.split(".").shift()
    entry[name] = path.resolve(__dirname, `../src/pages/${name}/index.js`)
});
console.log("NODE_ENV1", process.env.NODE_ENV)
module.exports = {
    entry,
    output: {
        //协商缓存
        filename: (pathData) => {
            if (pathData.chunk.name === "vendors" || pathData.chunk.name === "runtime") {
                return "common/[name].[contenthash].bundle.js"
            }
            else {
                return '[name]/[name].[contenthash].bundle.js'
            }
        },
        path: path.resolve(__dirname, '../dist'),
    },
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.esm.js' // 用 webpack 1 时需用 'vue/dist/vue.common.js'
        }
    },

    plugins: [
        ...HtmlWebpackPluginList,
        // new CopyPlugin({
        //     patterns: [
        //         { from: "static", to: "" },
        //     ],
        // }),
    ],
    module: {
        rules: [
            {
                test: /\.less$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    "postcss-loader",
                    'less-loader'
                ],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', "postcss-loader",],
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset',
                generator: {
                    filename: (pathData) => {
                        const paths = fileList.map(file => "src/pages/" + file.split(".").shift())
                        const item = paths.find(path => pathData.filename.includes(path))
                        if (item) {
                            return `${item.replace("src/pages/", "")}/image/[name].[contenthash][ext]`
                        }
                        return 'images/[name].[contenthash][ext]'
                    }
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 40 * 1024 // 4kb
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                }
            }
        ],

    },
    optimization: {
        // 如果添加动态导入，当解析顺序发生变化，ID 也会随之改变，node_modules中的依赖也会变
        moduleIds: 'deterministic',
        //提取mainfast
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                //把node_modules中的依赖单独打包，利于缓存
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
};
