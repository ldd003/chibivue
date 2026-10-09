export function createComponentInstance(vnode) {
  const type = vnode.type;
  const instance = {
    type,
    vnode,
    next: null,
    subTree: null,
    propsOptions: type.props || {},
    props: {},
    render: null,
    effect: null,
    update: null,
    isMounted: false,
  };
  return instance;
}
