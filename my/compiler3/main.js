import { createApp } from "./index.js";

// const app = createApp({
//   template: `<b class="hello" style="color: red;">Hello World!!</b>`,
// });

const app = createApp({
  setup() {
    // 使用 Promise.resolve 延迟处理，以便在挂载后可以执行 DOM 操作
    Promise.resolve().then(() => {
      const btn = document.getElementById("btn");
      btn &&
        btn.addEventListener("click", () => {
          const h2 = document.getElementById("hello");
          h2 && (h2.textContent += "!");
        });
    });
  },

  template: `
    <div class="container" style="text-align: center">
      <h2 id="hello">Hello, chibivue!</h2>
      <img
        width="150px"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png"
        alt="Vue.js Logo"
      />
      <p><b>chibivue</b> is the minimal Vue.js</p>

      <button id="btn"> click me! </button>

      <style>
        .container {
          height: 100vh;
          padding: 16px;
          background-color: #becdbe;
          color: #2c3e50;
        }
      </style>
    </div>
  `,
});

app.mount("#app");
