import { createApp } from "./index.js";

const app = createApp({
  template: `<b class="hello" style="color: red;">Hello World!!</b>`,
});

app.mount("#app");
