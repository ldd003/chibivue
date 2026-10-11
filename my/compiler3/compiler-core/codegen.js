import { NodeTypes } from "./ast.js";
import { toHandlerKey } from "../shared/index.js";

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

const genElement = (el) => {
  return `h("${el.tag}", {${el.props
    .map((prop) => genProp(prop))
    .join(", ")}}, [${el.children.map((it) => genNode(it)).join(", ")}])`;
};

const genProp = (prop) => {
  switch (prop.type) {
    case NodeTypes.ATTRIBUTE:
      return `${prop.name}: "${prop.value?.content}"`;
    case NodeTypes.DIRECTIVE: {
      switch (prop.name) {
        case "on":
          return `${toHandlerKey(prop.arg)}: ${prop.exp}`;

        default:
          throw new Error(`unexpected directive name. got "${prop.name}"`);
      }
    }
    default:
      throw new Error(`unexpected prop type.`);
  }
};

const genText = (text) => {
  return `\`${text.content}\``;
};

const genInterpolation = (node) => {
  return `${node.content}`;
};
