export function addEventListener(el, event, handler) {
  el.addEventListener(event, handler);
}

export function removeEventListener(el, event, handler) {
  el.removeEventListener(event, handler);
}

export function patchEvent(el, rawName, value) {
  // vei = vue event invokers
  const invokers = el._vei || (el._vei = {});
  const existingInvoker = invokers[rawName];

  if (value && existingInvoker) {
    // patch
    existingInvoker.value = value;
  } else {
    const name = parseName(rawName);
    if (value) {
      // add
      const invoker = (invokers[rawName] = createInvoker(value));
      addEventListener(el, name, invoker);
    } else if (existingInvoker) {
      // remove
      removeEventListener(el, name, existingInvoker);
      invokers[rawName] = undefined;
    }
  }
}

function parseName(rawName) {
  return rawName.slice(2).toLocaleLowerCase();
}

function createInvoker(initialValue) {
  const invoker = (e) => {
    invoker.value(e);
  };
  invoker.value = initialValue;
  return invoker;
}
