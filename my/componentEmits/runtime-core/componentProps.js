import { reactive } from "../reactivity/index.js";
import { camelize, hasOwn } from "../shared/general.js";

export function initProps(instance, rawProps) {
  const props = {};
  setFullProps(instance, rawProps, props);
  instance.props = reactive(props);
}

function setFullProps(instance, rawProps, props) {
  const options = instance.propsOptions;
  if (rawProps) {
    for (let key in rawProps) {
      const value = rawProps[key];
      //   if (options && options.hasOwnProperty(key)) {
      //     props[key] = value;
      //   }
      let camelKey;
      if (options && hasOwn(options, (camelKey = camelize(key)))) {
        props[camelKey] = value;
      }
    }
  }
}

export function updateProps(instance, rawProps) {
  const { props } = instance;
  //   Object.assign(props, rawProps);
  Object.entries(rawProps ?? {}).forEach(([key, value]) => {
    props[camelize(key)] = value;
  });
}
