import { emit } from "./componentEmits.js";
import { initProps } from "./componentProps.js";

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
    setupState: {},
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

  const component = instance.type;
  if (component.setup) {
    const setupResult = component.setup(instance.props, {
      emit: instance.emit,
    });
    if (typeof setupResult === "function") {
      instance.render = setupResult;
    } else if (typeof setupResult === "object" && setupResult !== null) {
      instance.setupState = setupResult;
    } else {
      // do nothing
    }
  }

  if (compile && !component.render) {
    const template = component.template ?? "";
    if (template) {
      instance.render = compile(template);
    }
  }
}
