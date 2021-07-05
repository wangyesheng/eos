// 只针对具体的某个包
const execa = require('execa'); // 开启子进程进行打包，最终还是使用 rollup 进行打包

const target = 'shared';

async function build(target) {
  await execa('rollup', ['-cw', '--environment', `TARGET:${target}`], {
    stdio: 'inherit', // 将子进程打包的信息共享给父进程
  });
}

build(target);
