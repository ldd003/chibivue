import { baseParse } from "./parse.js";
import { generate } from "./codegen.js";

export function baseCompile(template) {
  const parseResult = baseParse(template);
  const code = generate(parseResult);
  //'return () => {\n  const { h } = ChibiVue;\n  return h("b", { class: "hello", style: "color: red;" }, ["Hello World!!"]);\n}'
  return code;
}
