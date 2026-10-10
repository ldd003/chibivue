const hasOwnProperty = Object.prototype.hasOwnProperty;
export const hasOwn = (val, key) => hasOwnProperty.call(val, key);

const camelizeRE = /-(\w)/g;
export const camelize = (str) => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ""));
};

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const toHandlerKey = (str) => (str ? `on${capitalize(str)}` : ``);
