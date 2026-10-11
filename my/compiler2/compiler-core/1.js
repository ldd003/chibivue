function parseElement(context, ancestors) {
  // ① 解析开始标签。
  // 例如遇到 <div id="app">，解析出：
  // tag = "div"
  // props = [id="app"]
  // isSelfClosing = false
  const element = parseTag(context, TagType.Start);

  // ② 如果是自闭合标签，例如 <img src="a.png" />，
  // 就不需要继续解析子元素，也不需要寻找结束标签。
  if (element.isSelfClosing) {
    return element;
  }

  // ③ 把当前元素压入祖先栈。
  // 例如解析 <div><span>Hello</span></div> 时，
  // 解析 div 的子元素期间，ancestors = [div]；
  // 解析 span 的子元素期间，ancestors = [div, span]。
  ancestors.push(element);

  // ④ 解析当前元素内部的内容。
  // 例如 <div>Hello<span>Vue</span></div>，
  // children 包含文本节点 "Hello" 和 span 元素节点。
  const children = parseChildren(context, ancestors);

  // ⑤ 子元素解析完毕，当前元素退出祖先栈。
  // 这样返回到父元素的解析过程时，栈状态就恢复了。
  ancestors.pop();

  // ⑥ 把解析出的子节点挂到当前元素上。
  element.children = children;

  // ⑦ 如果接下来的源码是当前元素对应的结束标签，
  // 就解析它，例如当前元素是 div，源码以 </div> 开头。
  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.End);
  }

  // ⑧ 返回完整的元素节点。
  return element;
}

function parseTag(context, type) {
  // ① 记录标签起始位置。
  // 后续 getSelection(context, start) 会用它计算标签的源码范围。
  const start = getCursor(context);

  // ② 匹配标签名。
  //
  // /^<\/?([a-z][^\t\r\n\f />]*)/i
  //
  // 例如：
  // <div id="app">  -> match[0] = "<div"，match[1] = "div"
  // </div>          -> match[0] = "</div"，match[1] = "div"
  //
  // <\/? 表示可选的斜杠；
  // [a-z] 表示标签名以英文字母开头，i 表示不区分大小写；
  // 后面的字符不能是空白、/ 或 >。
  const match = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(context.source);
  const tag = match[1];

  // ③ 消费已经匹配的内容。
  // 例如源码是 <div id="app">，
  // 消费 "<div" 后，剩余源码为 " id=\"app\">"。
  advanceBy(context, match[0].length);

  // ④ 跳过标签名后的空白。
  // 例如剩余源码 "   id=\"app\">" 会变成 "id=\"app\">"。
  advanceSpaces(context);

  // ⑤ 解析属性。
  // 例如 id="app" class="container" 会生成两个属性节点。
  // 对结束标签，parseAttributes 不会把属性放入结果数组。
  let props = parseAttributes(context, type);

  // ⑥ 判断标签是否自闭合。
  let isSelfClosing = false;

  // 如果当前位置以 "/>" 开头，就是自闭合标签。
  // 例如 <img src="a.png" />，此时源码以 "/>" 开头。
  isSelfClosing = startsWith(context.source, "/>");

  // ⑦ 消费标签结束符。
  // 自闭合时消费 "/>" 两个字符；
  // 普通开始或结束标签则消费 ">" 一个字符。
  advanceBy(context, isSelfClosing ? 2 : 1);

  // ⑧ 返回元素节点。
  // 这里主要生成标签的基本结构，真正的子节点由 parseElement 填入。
  return {
    type: NodeTypes.ELEMENT,
    tag,
    props,
    children: [],
    isSelfClosing,
    // 记录标签从开始到结束的源码位置。
    // 例如 <div id="app"> 对应整个开始标签的范围。
    loc: getSelection(context, start),
  };
}

function parseAttributes(context, type) {
  // 保存解析到的属性节点。
  const props = [];

  // 用于记录已经出现的属性名。
  // 例如 id="a" id="b" 中，id 会被记录两次。
  // 当前代码只是收集名字，并没有在这里阻止重复属性。
  const attributeNames = new Set();

  // 只要还有源码，并且没有到达标签结束符，就继续解析属性。
  //
  // 例如：
  // id="app" class="box">
  //
  // 每轮循环解析一个属性，直到遇到 ">"。
  // 遇到 "/>" 时也停止，例如 <img src="a.png" />。
  while (
    context.source.length > 0 &&
    !startsWith(context.source, ">") &&
    !startsWith(context.source, "/>")
  ) {
    // 解析一个属性，例如 id="app"。
    const attr = parseAttribute(context, attributeNames);

    // 只有开始标签的属性才加入 props。
    // 例如 <div id="app"> 的 id 会被保留；
    // </div> 即使出现属性文本，也不会将它们放入结果数组。
    if (type === TagType.Start) {
      props.push(attr);
    }

    // 跳过下一个属性前的空白。
    // 例如解析完 id="app" 后，剩余源码是 " class=\"box\">"。
    advanceSpaces(context);
  }

  // 返回解析好的属性节点数组。
  return props;
}

function parseAttribute(context, nameSet) {
  // ① 记录属性的起始位置。
  // 例如解析 id="app" 时，start 指向 id 的第一个字符。
  const start = getCursor(context);

  // ② 匹配属性名。
  //
  // /^[\t\r\n\f />][^\t\r\n\f />=]*/ 不是这里使用的表达式；
  // 实际表达式是：
  // /^[^\t\r\n\f />][^\t\r\n\f />=]*/
  //
  // 第一个字符不能是空白、/ 或 >；
  // 后续字符不能是空白、/、> 或 =。
  //
  // 例如：
  // id="app"  -> name = "id"
  // disabled  -> name = "disabled"
  const match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source);
  const name = match[0];

  // ③ 记录属性名。
  // Set 会自动去重，但这里只是记录，并没有检查重复属性并报错。
  nameSet.add(name);

  // ④ 消费属性名。
  // 例如 id="app" -> 剩余源码变成 ="app"。
  advanceBy(context, name.length);

  // ⑤ 默认没有属性值。
  // 例如 disabled 是布尔属性形式，没有显式的等号和值。
  let value = undefined;

  // ⑥ 检查属性名后面是否存在可选空白和等号。
  // 例如：
  // id="app"   -> 匹配
  // id = "app" -> 也匹配
  // disabled   -> 不匹配
  if (/^[\t\r\n\f ]*=/.test(context.source)) {
    // 跳过等号前的空白。
    advanceSpaces(context);

    // 消费 "="。
    advanceBy(context, 1);

    // 跳过等号后的空白。
    advanceSpaces(context);

    // ⑦ 解析属性值。
    // 例如 "app" -> content = "app"。
    value = parseAttributeValue(context);
  }

  // ⑧ 记录属性完整的源码范围。
  // 如果源码是 id="app"，范围包含 id、等号和引号。
  const loc = getSelection(context, start);

  // ⑨ 返回属性 AST 节点。
  return {
    type: NodeTypes.ATTRIBUTE,
    name,

    // 没有属性值时，value 为 undefined。
    // 有属性值时，构造一个 TEXT 类型的值节点。
    // 例如 id="app" 的 value.content 为 "app"。
    value: value && {
      type: NodeTypes.TEXT,
      content: value.content,
      loc: value.loc,
    },

    // 属性自身的源码位置，与属性值自身的 loc 不同。
    loc,
  };
}

function parseAttributeValue(context) {
  // ① 记录属性值开始时的位置。
  // 如果源码是 id="app"，此时指向引号 "。
  const start = getCursor(context);

  let content;

  // ② 读取当前字符，判断属性值是否由引号包围。
  const quote = context.source[0];
  const isQuoted = quote === `"` || quote === `'`;

  if (isQuoted) {
    // ③ 有引号的属性值。
    // 先消费开头的引号。
    // 例如 "app" -> 剩余源码变成 app"。
    advanceBy(context, 1);

    // ④ 找到与开头相同的引号。
    // 双引号开头就寻找下一个双引号；
    // 单引号开头就寻找下一个单引号。
    const endIndex = context.source.indexOf(quote);

    if (endIndex === -1) {
      // ⑤ 没找到结束引号。
      // 当前简化实现会把剩余内容全部当作属性值。
      // 例如源码为 "app，剩余内容 app 会被读取。
      content = parseTextData(context, context.source.length);
    } else {
      // ⑥ 找到了结束引号。
      // 只读取引号内部的内容，不包含引号。
      // 例如 app" -> content = "app"，剩余源码是 "。
      content = parseTextData(context, endIndex);

      // ⑦ 消费结束引号。
      advanceBy(context, 1);
    }
  } else {
    // ⑧ 无引号的属性值。
    // 匹配直到空白或 ">" 为止的内容。
    // 例如 id=app -> content = "app"。
    const match = /^[^\t\r\n\f >]+/.exec(context.source);

    // 如果当前位置没有合法的无引号值，就返回 undefined。
    if (!match) {
      return undefined;
    }

    // ⑨ 消费匹配到的属性值。
    content = parseTextData(context, match[0].length);
  }

  // ⑩ 返回属性值内容及其源码位置。
  return { content, loc: getSelection(context, start) };
}
