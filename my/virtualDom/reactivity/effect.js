import { createDep } from "./dep.js";

const targetMap = new WeakMap();
let activeEffect;

export class ReactiveEffect {
  constructor(fn) {
    this.fn = fn;
  }
  run() {
    let parent = activeEffect;
    activeEffect = this;
    const res = this.fn();
    activeEffect = parent;

    return res;
  }
}

export function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = createDep()));
  }

  if (activeEffect) {
    dep.add(activeEffect);
  }
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const dep = depsMap.get(key);

  if (dep) {
    const effects = [...dep];
    for (const effect of effects) {
      effect.run();
    }
  }
}
