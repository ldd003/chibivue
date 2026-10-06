import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { chapters } from "../src/chapters.generated.ts";

test("createApp emits a WebContainer-compatible project and preserves its source", () => {
  const chapter = chapters.find((chapter) => chapter.name === "createApp");
  assert.ok(chapter);
  const pkg = JSON.parse(chapter.files.find((file) => file.path === "package.json")!.content);
  assert.equal(pkg.scripts.dev, "vite --host 0.0.0.0");
  assert.equal(pkg.devDependencies.vite, "^6.0.0");
  assert.equal(pkg.devDependencies["vite-plus"], undefined);
  assert.equal(pkg.pnpm.overrides.rollup, "npm:@rollup/wasm-node@^4.0.0");
  assert.ok(pkg.pnpm.onlyBuiltDependencies.includes("esbuild"));
  const config = chapter.files.find((file) => file.path === "vite.config.ts")!.content;
  assert.match(config, /from "vite"/);
  assert.match(config, /path.resolve\(dirname, "packages"\)/);
  const original = JSON.parse(
    readFileSync(
      new URL(
        "../../impls/10_minimum_example/010_create_app/examples/playground/package.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  assert.equal(original.scripts.dev, "vp dev");
});

test("generated compiler plugins use Vite and retain their required dependencies", () => {
  let pluginCount = 0;
  for (const chapter of chapters) {
    for (const file of chapter.files) {
      assert.doesNotMatch(file.content, /["']vite-plus(?:\/client)?["']/);
      if (!file.path.endsWith("packages/@extensions/vite-plugin-chibivue/index.ts")) continue;
      pluginCount++;
      assert.match(file.content, /from "vite"/);
      const manifest = chapter.files.find((file) => file.path === "package.json");
      if (!manifest) continue;
      const config = chapter.files.find((file) => file.path === "vite.config.ts");
      if (!config?.content.includes("vite-plugin-chibivue")) continue;
      const pkg = JSON.parse(manifest.content);
      assert.ok(pkg.dependencies["@babel/parser"]);
      assert.ok(pkg.dependencies["magic-string"]);
      assert.ok(pkg.dependencies["estree-walker"]);
    }
  }
  assert.ok(pluginCount > 0);
});
