export * from "./runtime-core/index.js";
export * from "./runtime-dom/index.js";
import * as runtimeDom from "./runtime-dom/index.js";

import { compile } from "./compiler-dom/index.js";
import { registerRuntimeCompiler } from "./runtime-core/index.js";

function compileToFunction(template) {
  const code = compile(template);
  return new Function("ChibiVue", code)(runtimeDom);
}

registerRuntimeCompiler(compileToFunction);
