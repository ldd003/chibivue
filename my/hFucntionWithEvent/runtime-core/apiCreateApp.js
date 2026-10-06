export function createAppAPI(render) {
  return function createApp(rootComponent) {
    const app = {
      mount(rootContainer) {
        const vnode = rootComponent.render();
        console.log(100, vnode); //
        render(vnode, rootContainer);
      },
    };
    return app;
  };
}
