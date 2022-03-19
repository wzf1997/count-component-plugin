
const path = require('path')
import ts from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve' // 依赖引用插件
import commonjs from 'rollup-plugin-commonjs' // 将commonjs 转换成esM  
import * as rollup from 'rollup'

const getPath = _path => path.resolve(__dirname, _path)
// 解析pa
const pkg =  require('./package.json')

const extensions = [
    '.js',
    '.ts',
]
const tsPlugin = ts({
    tsconfig: getPath('./tsconfig.json'), // 导入本地ts 配置
    extensions
})

const outputs = [
    {file: pkg.main, format: 'cjs' },
    {file: pkg.module, format: 'esm'}
]


 
export default rollup.defineConfig( outputs.map(opt => {
    return {
        input: 'src/main.ts',
        output: opt, 
        plugins: [resolve(), commonjs(),tsPlugin],
        external: opt.format === 'cjs' ? [] : ["chalk", "to-excel"]
    }
}))