// export const generate = ({ tag, props, textContent }) => {
//   return `return () => {
//   const { h } = ChibiVue;
//   return h("${tag}", { ${Object.entries(props)
//     .map(([k, v]) => `${k}: "${v}"`)
//     .join(", ")} }, ["${textContent}"]);
// }`;
// };

import { NodeTypes } from "./ast.js";

export const generate = ({ children }) => {
  return `
  return function render(){
    const {h} = ChibiVue;
    return ${genNode(children[0])}
  }
  `;
};

function genNode(node) {
  switch (node.type) {
    case NodeTypes.ELEMENT:
      return genElement(node);
    case NodeTypes.TEXT:
      return genText(node);

    default:
      return "";
  }
}

// function genElement(el) {
//   return `h("${el.tag}",{${el.props.map(({ name, value }) => `${name}:${value}`).join(", ")}},[${el.children.map((it) => genNode(it)).join(", ")}])`;
// }

// function genText(node) {
//   return `${node.content}`;
// }

const genElement = (el) => {
  return `h("${el.tag}", {${el.props
    .map(({ name, value }) => `${name}: "${value?.content}"`)
    .join(", ")}}, [${el.children.map((it) => genNode(it)).join(", ")}])`;
};

const genText = (text) => {
  return `\`${text.content}\``;
};
