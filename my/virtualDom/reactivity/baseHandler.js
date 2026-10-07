import { track, trigger } from "./effect.js";
import { reactive } from "./reactive.js";

export const mutableHandlers = {
  get(target, key, receiver) {
    track(target, key);
    const res = Reflect.get(target, key, receiver);
    if (res !== null && typeof res === "object") {
      return reactive(res);
    }
    return res;
  },
  set(target, key, value, receiver) {
    let oldValue = target[key];
    Reflect.set(target, key, value, receiver);
    if (hasChanged(value, oldValue)) {
      trigger(target, key);
    }
    return true;
  },
};

const hasChanged = (value, oldValue) => {
  return !Object.is(value, oldValue);
};
