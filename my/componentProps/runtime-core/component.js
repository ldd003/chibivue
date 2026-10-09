export function createComponentInstance(vnode) {
  const type = vnode.type;
  const instance = {
    type,
    vnode,
    next: null,
    effect: null,
    subTree: null,
    update: null,
    render: null,
    isMounted: false,
  };
  return instance;
}
