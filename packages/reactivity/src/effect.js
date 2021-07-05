import { isArray } from '@eos/shared';

function effect(fn, ops = {}) {
  const effect = createReactiveEffect(fn, ops);
  if (!ops.lazy) effect();
  return effect;
}

let uid = 0;
let activeEffect;
const effectStack = [];
function createReactiveEffect(fn, ops) {
  const effect = function reactiveEffect() {
    if (!effectStack.includes(effect)) {
      try {
        activeEffect = effect;
        effectStack.push(effect);
        fn();
      } finally {
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  };
  effect.id = uid++; // effect 标识，用于区分 effect
  effect._isEffect = true; // 用于标识这个 effect 是响应式 effect
  effect.raw = fn; // 保留 effect 对应的原函数
  effect.ops = ops; // 在 effect 保存用户的属性
  return effect;
}

let targetMap = new WeakMap();
function track(target, type, key) {
  if (!activeEffect) {
    // 此属性不用依赖收集，因为没在 effect 中使用
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  if (!deps.has(activeEffect)) {
    deps.add(activeEffect);
  }
}

function trigger(target, type, key, newValue, oldValue) {
  // console.log(target, type, key, newValue, oldValue);
  // console.log(targetMap);
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const effects = new Set();
  const add = effectDeps => {
    if (effectDeps) {
      effectDeps.forEach(effect => effects.add(effect));
    }
  };

  // 将所有 effects 存到一个集合中，最终一起执行
  if (key === 'length' && isArray(target)) {
    // 看修改的是不是数组的长度，修改数组长度影响较大
    depsMap.forEach((deps, key) => {
      // console.log(depsMap, deps, key, newValue, oldValue);
      // key => effect 中当时的数组下标
      // 假设下标大于现在的数组长度也需要更新
      if (key === 'length' || key > newValue) {
        add(deps);
      }
    });
  } else {
    // 可能是对象
  }

  effects.forEach(e => e());
}

export { effect, track, trigger };
