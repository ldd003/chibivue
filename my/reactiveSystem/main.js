import { createApp, h } from "./index.js";
import { reactive } from "./reactivity/index.js";

const app = createApp({
  setup() {
    const state = reactive({ count: 0 });

    const increment = () => {
      state.count++;
    };

    return () =>
      h("div", { id: "my-app" }, [
        h("p", {}, [`count: ${state.count}`]),
        h("button", { onClick: increment }, ["increment"]),
      ]);
  },
});

app.mount("#app");
