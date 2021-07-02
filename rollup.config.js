// console.log('rollup', process.env.TARGET);
// 根据环境变量中的 TARGET 属性，获取对应模块下的 package.json 进行打包
// rollup 中默认可以使用 esm 的打包方式

import path from 'path';
import jsonPlugin from '@rollup/plugin-json';
import resolvePlugin from '@rollup/plugin-node-resolve';

const packagesDir = path.resolve(__dirname, 'packages');

// 打包的基准目录
const packageDir = path.resolve(packagesDir, process.env.TARGET);

function resolve(_path) {
  return path.resolve(packageDir, _path);
}

const packageJson = require(resolve('package.json'));
const filename = path.basename(packageDir);

// 对打包类型先做一个映射表，根据提供的 formats 来格式化需要打包的内容
const outputConfig = {
  'esm-bundler': {
    file: resolve(`dist/${filename}.esm-bundler.js`),
    format: 'es',
  },
  cjs: {
    file: resolve(`dist/${filename}.cjs.js`),
    format: 'cjs',
  },
  global: {
    file: resolve(`dist/${filename}.global.js`),
    format: 'iife',
  },
};

const buildOps = packageJson.buildOptions;

function createConfig(format, output) {
  output.name = buildOps.name;
  output.sourcemap = true;
  return {
    input: resolve('src/index.js'),
    output,
    plugins: [jsonPlugin(), resolvePlugin()],
  };
}

// rollup 最终需要导出配置
export default buildOps.formats.map(format =>
  createConfig(format, outputConfig[format])
);
