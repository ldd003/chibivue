export function createAppAPI(render) {
  return function createApp(rootComponent) {
    const app = {
      mount(rootContainer) {
        const componentRender = rootComponent.setup();

        const updateComponent = () => {
          const vnode = componentRender();
          console.log(100, vnode);
          render(vnode, rootContainer);
        };
        updateComponent();
      },
    };
    return app;
  };
}
