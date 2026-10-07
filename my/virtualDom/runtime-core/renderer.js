import { Text, normalizeVNode } from "./vnode.js";
import { ReactiveEffect } from "../reactivity/index.js";

export function createRenderer(options) {
  const {
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    setText: hostSetText,
    insert: hostInsert,
  } = options;

  const patch = (n1, n2, container) => {
    const { type } = n2;
    if (type === Text) {
      processText(n1, n2, container);
    } else {
      processElement(n1, n2, container);
    }
  };

  const processText = (n1, n2, container) => {
    if (n1 == null) {
      hostInsert((n2.el = hostCreateText(n2.children)), container);
    } else {
      const el = (n2.el = n1.el);
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };

  const processElement = (n1, n2, container) => {
    if (n1 == null) {
      mountElement(n2, container);
    } else {
      patchElement(n1, n2);
    }
  };

  const mountElement = (vnode, container) => {
    let el;
    const { type, props } = vnode;
    el = vnode.el = hostCreateElement(type);

    mountChildren(vnode.children, el);

    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, props[key]);
      }
    }

    hostInsert(el, container);
  };

  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      const child = (children[i] = normalizeVNode(children[i]));
      patch(null, child, container);
    }
  };

  const patchElement = (n1, n2) => {
    const el = (n2.el = n1.el);
    const props = n2.props;

    patchChildren(n1, n2, el);

    for (const key in props) {
      if (props[key] !== n1.props[key]) {
        hostPatchProp(el, key, props[key]);
      }
    }
  };

  const patchChildren = (n1, n2, container) => {
    const c1 = n1.children;
    const c2 = n2.children;

    for (let i = 0; i < c2.length; i++) {
      const child = (c2[i] = normalizeVNode(c2[i]));
      patch(c1[i], child, container);
    }
  };

  const render = (rootComponent, container) => {
    const componentRender = rootComponent.setup();
    let n1 = null;
    const updateComponent = () => {
      const n2 = componentRender();
      patch(n1, n2, container);
      n1 = n2;
    };
    const effect = new ReactiveEffect(updateComponent);
    effect.run();
  };

  return {
    render,
  };
}
