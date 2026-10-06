export function createRenderer(nodeOps) {
  const { setElementText: hostSetElementText } = nodeOps;

  const render = (message, container) => {
    hostSetElementText(container, message);
  };

  return {
    render,
  };
}
