const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
const base = require('./webpack.base.js');

const prodConfig = {
  mode:'production',
  output:{
      //每次构建清除dist目录
      clean: true,
  },
  plugins: [
    //长期缓存
    new MiniCssExtractPlugin({
      filename:"[name]/[name].[contenthash].css",
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader",],
      },
      {
        test: /\.less$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          "postcss-loader",
          'less-loader',
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      // `...`,
      new CssMinimizerPlugin(),
      new TerserJSPlugin({})
    ],
  },
}

prodConfig.module.rules.forEach(_item => {
  const index = base.module.rules.findIndex(item => (item.test + "") == (_item.test + ""))
  if (index != -1) {
    base.module.rules.splice(index, 1)
  }
})

module.exports = merge(base, prodConfig);