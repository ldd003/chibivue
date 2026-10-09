export function createAppAPI(render) {
  return function createApp(rootComponent) {
    const app = {
      mount(rootContainer) {
        render(rootComponent, rootContainer);
      },
    };
    return app;
  };
}
