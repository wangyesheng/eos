// 把 packages 目录下所有的包都进行打包

const fs = require('fs');
const execa = require('execa'); // 开启子进程进行打包，最终还是使用 rollup 进行打包

const targetDirs = fs
  .readdirSync('packages')
  .filter(dir => fs.statSync(`packages/${dir}`).isDirectory());

async function build(target) {
  await execa('rollup', ['-wc', '--environment', `TARGET:${target}`], {
    stdio: 'inherit', // 将子进程打包的信息共享给父进程
  });
}

function runParallel(dirs, iteratorFn) {
  const promiseWrap = [];
  for (const dir of dirs) {
    // 并行打包
    const promise = iteratorFn(dir);
    promiseWrap.push(promise);
  }
  return Promise.all(promiseWrap);
}

runParallel(targetDirs, build); 
