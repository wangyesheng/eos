const isObject = value => typeof value === 'object' && value !== null;

const extend = Object.assign;

const isArray = Array.isArray;

const isFunction = value => typeof value === 'function';

const isNumber = value => typeof value === 'number';

const isString = value => typeof value === 'string';

const isIntegerKey = key =>
  isString(key) &&
  key !== 'NaN' &&
  key[0] !== '-' &&
  '' + parseInt(key, 10) === key;

const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (target, key) => hasOwnProperty.call(target, key);

export {
  isObject,
  extend,
  isArray,
  isFunction,
  isNumber, 
  isString,
  isIntegerKey,
  hasOwn,
};
