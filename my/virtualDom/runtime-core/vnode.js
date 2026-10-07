export const Text = Symbol();

export function createVNode(type, props, children) {
  const vnode = {
    type,
    props,
    children,
    el: null,
  };
  return vnode;
}

export function normalizeVNode(child) {
  if (typeof child === "object") {
    return { ...child };
  } else {
    return createVNode(Text, null, String(child));
  }
}
