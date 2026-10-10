import { createApp, h } from "./index.js";
import { reactive } from "./reactivity/index.js";

const MyComponent = {
  props: { someMessage: { type: String } },

  setup(props, { emit }) {
    return () =>
      h("div", {}, [
        h("p", {}, [`someMessage: ${props.someMessage}`]),
        h("button", { onClick: () => emit("click:change-message") }, [
          "change message",
        ]),
      ]);
  },
};

const app = createApp({
  setup() {
    const state = reactive({ message: "hello" });
    const changeMessage = () => {
      state.message += "!";
    };

    return () =>
      h("div", { id: "my-app" }, [
        h(
          MyComponent,
          {
            "some-message": state.message,
            "onClick:change-message": changeMessage,
          },
          [],
        ),
      ]);
  },
});

app.mount("#app");
