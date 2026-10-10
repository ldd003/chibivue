export const baseParse = (content) => {
  const matched = content.match(/<(\w+)\s+([^>]*)>([^<]*)<\/\1>/);
  if (!matched)
    return {
      tag: "",
      props: "",
      textContent: "",
    };
  const [_, tag, attrs, textContent] = matched;
  const props = {};

  //'class="hello" style="color: red;"'.match(/(\w+)=['"]([^'"]+)['"]/g)
  //=>['class="hello"', 'style="color: red;"']
  attrs.replace(/(\w+)=['"]([^'"]+)['"]/g, (_, key, value) => {
    props[key] = value;
    return "";
  });

  return {
    tag,
    props,
    textContent,
  };
};
