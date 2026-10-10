import { emit } from "./componentEmits.js";

export function createComponentInstance(vnode) {
  const type = vnode.type;
  const instance = {
    type,
    vnode,
    next: null,
    subTree: null,
    propsOptions: type.props || {},
    props: {},
    emit: null,
    render: null,
    effect: null,
    update: null,
    isMounted: false,
  };
  instance.emit = emit.bind(null, instance);
  return instance;
}
