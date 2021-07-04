import { extend, isObject } from "@eos/shared";
import { reactive, readonly } from "./reactive";

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
    console.log("getter");
    const result = Reflect.get(target, key, receiver);

    if (!isReadonly) {
      // 可能之后会被改，收集依赖
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
  console.log("setter");
  return function set(target, key, value, receiver) {};
}

export {
  mutableHandlers,
  shallowReactiveHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
};
