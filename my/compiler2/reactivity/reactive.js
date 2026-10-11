import { mutableHandlers } from "./baseHandler.js";

export function reactive(target) {
  const proxy = new Proxy(target, mutableHandlers);

  return proxy;
}
