import serve from 'rollup-plugin-serve';
import babel from 'rollup-plugin-babel';


export default {
    input: './src/index.js',
    output: {
        file: './dist/vue.js',
        name: 'Vue', // 全局名字
        format: 'umd',
        sourcemap: true
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        serve({
            openPage: './public/index.html',
            port: 3000,
            contentBase: '',
            open: true
        })
    ]
}