export function createAppAPI(render) {
  return function createApp(rootComponent) {
    const app = {
      mount(rootContainer) {
        const message = rootComponent.render();
        render(message, rootContainer);
      },
    };
    return app;
  };
}
