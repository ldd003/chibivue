export function createRenderer(options) {
  const {
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    insert: hostInsert,
  } = options;

  const renderVNode = (vnode) => {
    if (typeof vnode === "string") return hostCreateText(vnode);
    const el = hostCreateElement(vnode.type);

    Object.entries(vnode.props).forEach(([key, value]) => {
      console.log(99, key, value);
      hostPatchProp(el, key, value);
    });

    for (const child of vnode.children) {
      const childEl = renderVNode(child);
      hostInsert(childEl, el);
    }
    return el;
  };

  const render = (vnode, container) => {
    const el = renderVNode(vnode);
    hostInsert(el, container);
  };

  return {
    render,
  };
}
