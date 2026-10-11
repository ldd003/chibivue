import { toHandlerKey, camelize } from "../shared/index.js";

export function emit(instance, event, ...rawArgs) {
  const props = instance.vnode.props || {};
  let args = rawArgs;
  let handler =
    props[toHandlerKey(event)] || props[toHandlerKey(camelize(event))];
  if (handler) {
    handler(...args);
  }
}
