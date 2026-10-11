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
  return function render(_ctx){
    with(_ctx){
      const {h} = ChibiVue;
      return ${genNode(children[0])}
    }
  }
  `;
};

function genNode(node) {
  switch (node.type) {
    case NodeTypes.ELEMENT:
      return genElement(node);
    case NodeTypes.TEXT:
      return genText(node);
    case NodeTypes.INTERPOLATION:
      return genInterpolation(node);

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
    .map(({ name, value }) =>
      // 如果是 @click，将 props 名称转换为 onClick
      name === "@click"
        ? `onClick: ${value?.content}`
        : `${name}: "${value?.content}"`,
    )
    .join(", ")}}, [${el.children.map((it) => genNode(it)).join(", ")}])`;
};

const genText = (text) => {
  return `\`${text.content}\``;
};

const genInterpolation = (node) => {
  return `${node.content}`;
};
