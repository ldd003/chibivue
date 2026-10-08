import { createApp, h } from "./index.js";
import { reactive } from "./reactivity/index.js";

// const CounterComponent = {
//   setup() {
//     const state = reactive({ count: 0 });
//     const increment = () => state.count++;

//     return () =>
//       h("div", {}, [
//         h("p", {}, [`count: ${state.count}`]),
//         h("button", { onClick: increment }, ["increment"]),
//       ]);
//   },
// };

const app = createApp({
  name: "App",
  setup: () => {
    const colors = reactive({
      color1: "red",
    });
    const changeColor = () => {
      colors.color1 = colors.color1 === "red" ? "blue" : "red";
    };
    return () =>
      h("div", { id: "my-app", style: `color: ${colors.color1}` }, [
        // h(CounterComponent, {}, []),
        // h(CounterComponent, {}, []),
        // h(CounterComponent, {}, []),
        h(
          "span",
          {
            onClick: changeColor,
          },
          ["hellos"],
        ),
        // h("span", {}, ["world"]),
      ]);
  },
});

app.mount("#app");
