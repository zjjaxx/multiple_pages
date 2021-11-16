module.exports={
    presets: [['@babel/preset-env',{
        useBuiltIns:"usage",
        corejs:"3.18.1"
    }]],
    plugins: ['@babel/plugin-transform-runtime']
}