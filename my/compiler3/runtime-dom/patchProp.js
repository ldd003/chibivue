import { patchEvent } from "./modules/events.js";
import { patchAttr } from "./modules/attrs.js";

const onRE = /^on[^a-z]/;

export const isOn = (key) => onRE.test(key);

export const patchProp = (el, key, value) => {
  if (isOn(key)) {
    patchEvent(el, key, value);
  } else {
    patchAttr(el, key, value);
  }
};
