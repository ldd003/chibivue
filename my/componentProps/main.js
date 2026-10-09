import { createApp, h } from "./index.js";
import { reactive } from "./reactivity/index.js";

const MyComponent = {
  name: "MyComponent",
  props: { someMessage: "" },

  setup(props) {
    return () => h("div", { id: "my-app" }, [`message: ${props.someMessage}`]);
  },
};

const app = createApp({
  name: "App",
  setup() {
    const state = reactive({ message: "hello" });
    const changeMessage = () => {
      state.message += "!";
    };

    return () =>
      h("div", { id: "my-app" }, [
        h(MyComponent, { "some-message": state.message }, []),
        h("button", { onClick: changeMessage }, ["change message"]),
      ]);
  },
});

app.mount("#app");
