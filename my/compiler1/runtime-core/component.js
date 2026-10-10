import { emit } from "./componentEmits.js";

let compile;

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

export function registerRuntimeCompiler(_compile) {
  compile = _compile;
}

export function setupComponent(instance) {
  const { props } = instance.vnode;
  initProps(instance, props);

  const component = initialVNode.type;
  if (component.setup) {
    instance.render = component.setup(instance.props, {
      emit: instance.emit,
    });
  }
}
