// import { ReactiveEffect } from "../reactivity/index.js";

export function createAppAPI(render) {
  return function createApp(rootComponent) {
    const app = {
      mount(rootContainer) {
        render(rootComponent, rootContainer);
        // const componentRender = rootComponent.setup();

        // const updateComponent = () => {
        //   const vnode = componentRender();
        //   render(vnode, rootContainer);
        // };

        // const effect = new ReactiveEffect(updateComponent);
        // effect.run();
      },
    };
    return app;
  };
}
