import { nodeOps } from "./nodeOps.js";
import { createRenderer, createAppAPI } from "../runtime-core/index.js";

const { render } = createRenderer(nodeOps);

const _creatApp = createAppAPI(render);

export const createApp = (...args) => {
  const app = _creatApp(...args);

  const { mount } = app;

  app.mount = (selector) => {
    const container = document.querySelector(selector);
    if (!container) return;
    mount(container);
  };

  return app;
};
