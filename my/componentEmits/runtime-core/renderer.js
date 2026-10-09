import { Text, normalizeVNode, createVNode } from "./vnode.js";
import { ReactiveEffect } from "../reactivity/index.js";
import { createComponentInstance } from "./component.js";
import { initProps, updateProps } from "./componentProps.js";

export function createRenderer(options) {
  const {
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    setText: hostSetText,
    insert: hostInsert,
    parentNode: hostParentNode,
  } = options;

  const patch = (n1, n2, container) => {
    const { type } = n2;
    if (type === Text) {
      processText(n1, n2, container);
    } else if (typeof type === "string") {
      processElement(n1, n2, container);
    } else if (typeof type === "object") {
      processComponent(n1, n2, container);
    } else {
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

  const processComponent = (n1, n2, container) => {
    if (n1 === null) {
      mountComponent(n2, container);
    } else {
      updateComponent(n1, n2);
    }
  };

  const mountComponent = (initialVNode, container) => {
    // debugger;
    const instance = (initialVNode.component =
      createComponentInstance(initialVNode));

    const { props } = instance.vnode;
    initProps(instance, props);

    const component = initialVNode.type;
    if (component.setup) {
      instance.render = component.setup(instance.props, {
        emit: instance.emit,
      });
    }
    setupRenderEffect(instance, initialVNode, container);
  };

  const setupRenderEffect = (instance, initialVNode, container) => {
    const componentUpdateFn = () => {
      const { render } = instance;

      if (!instance.isMounted) {
        const subTree = (instance.subTree = normalizeVNode(render()));
        patch(null, subTree, container);
        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        let { next, vnode } = instance;
        if (next) {
          next.el = vnode.el;
          next.component = instance;
          instance.vnode = next;
          instance.next = null;
          updateProps(instance, next.props);
        } else {
          next = vnode;
        }

        const prevTree = instance.subTree;
        const nextTree = normalizeVNode(render());
        instance.subTree = nextTree;

        patch(prevTree, nextTree, hostParentNode(prevTree.el));
        next.el = nextTree.el;
      }
    };
    componentUpdateFn.types = initialVNode.type;
    const effect = (instance.effect = new ReactiveEffect(componentUpdateFn));
    const update = (instance.update = () => effect.run());
    update();
  };

  const updateComponent = (n1, n2) => {
    const instance = (n2.component = n1.component);
    instance.next = n2;
    instance.update();
  };

  const render = (rootComponent, container) => {
    const vnode = createVNode(rootComponent, {}, []);
    patch(null, vnode, container);
  };

  return {
    render,
  };
}
