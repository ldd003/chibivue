import { createApp, h } from "./index.js";

createApp({
  render() {
    return h("div", {}, [
      h("p", {}, ["Hello world."]),
      h("button", {}, ["click me!"]),
    ]);
  },
}).mount("#app");
