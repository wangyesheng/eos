import { extend, isObject, isIntegerKey, hasOwn, isArray } from '@eos/shared';
import { reactive, readonly } from './reactive';
import { track, trigger } from './effect';
import { TRACK_OPERATION_TYPES, TRIGGER_OPERATION_TYPES } from './operators';

const get = createGetter();
const shallowGet = createGetter(false, true);
const readonlyGet = createGetter(true, false);
const shallowReadonlyGet = createGetter(true, true);

const set = createSetter();
const shallowSet = createSetter();

const setForReadonlyObject = {
  set(target, key) {
    console.warn(
      `Cannot set attribute [${key}] on a read-only objects [${JSON.stringify(
        target
      )}]`
    );
  },
};

const mutableHandlers = {
  get,
  set,
};

const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet,
};

const readonlyHandlers = extend(
  {
    get: readonlyGet,
  },
  setForReadonlyObject
);

const shallowReadonlyHandlers = extend(
  {
    get: shallowReadonlyGet,
  },
  setForReadonlyObject
);

function createGetter(isReadonly = false, isShallow = false) {
  return function get(target, key, receiver) {
    const result = Reflect.get(target, key, receiver);

    if (!isReadonly) {
      // 可能之后会被改，收集依赖
      track(target, TRACK_OPERATION_TYPES.GET, key);
    }

    if (isShallow) {
      return result;
    }

    if (isObject(result)) {
      return isReadonly ? readonly(result) : reactive(result);
    }

    return result;
  };
}

function createSetter(isShallow = false) {
  return function set(target, key, value, receiver) {
    // console.log('createSetter', target, key, value, receiver);
    const oldValue = target[key];

    const hadKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key);

    const result = Reflect.set(target, key, value, receiver);
    
    if (!hadKey) {
      // 新增
      trigger(target, TRIGGER_OPERATION_TYPES.ADD, key, value, oldValue);
    } else if (oldValue !== value) {
      // 修改
      trigger(target, TRIGGER_OPERATION_TYPES.UPDATE, key, value, oldValue);
    }
  };
}

export {
  mutableHandlers,
  shallowReactiveHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
};
