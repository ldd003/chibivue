export const generate = ({ tag, props, textContent }) => {
  return `return () => {
  const { h } = ChibiVue;
  return h("${tag}", { ${Object.entries(props)
    .map(([k, v]) => `${k}: "${v}"`)
    .join(", ")} }, ["${textContent}"]);
}`;
};
