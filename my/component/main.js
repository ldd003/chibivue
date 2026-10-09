import { createApp, h } from "./index.js";
import { reactive } from "./reactivity/index.js";

const CounterComponent = {
  name: "Counter",
  setup() {
    const state = reactive({ count: 0 });
    const increment = () => state.count++;

    return () =>
      h("div", {}, [
        h("p", {}, [`count: ${state.count}`]),
        h("button", { onClick: increment }, ["increment"]),
      ]);
  },
};

const app = createApp({
  name: "App",
  setup: () => {
    const colors = reactive({
      color1: "red",
    });
    const changeColor = () => {
      console.log(100);
      colors.color1 = colors.color1 === "red" ? "blue" : "red";
    };
    // return () => h(CounterComponent, {}, []);
    return () =>
      h(
        "div",
        {
          id: "my-app",

          // style: `color: ${colors.color1}`,
        },
        [
          h(CounterComponent, { aa: 11 }, []),
          // h(CounterComponent, {}, []),
          // h(CounterComponent, {}, []),
          h(
            "span",
            {
              style: `color: ${colors.color1}`,
              onClick: changeColor,
            },
            ["hellos"],
          ),
          // h("span", {}, ["world"]),
        ],
      );
  },
});

app.mount("#app");
