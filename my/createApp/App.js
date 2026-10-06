export const createApp = (opts) => {
  return {
    mount(id) {
      const container = document.querySelector(id);
      container.innerText = opts.render();
    },
  };
};
