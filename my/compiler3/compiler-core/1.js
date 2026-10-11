function parseInterpolation(context) {
  // ① 定义插值表达式的开始符和结束符。
  // 例如：{{ message }}
  // open  = "{{"
  // close = "}}"
  const [open, close] = ["{{", "}}"];

  // ② 查找结束符 "}}" 的位置。
  // 从 open.length 开始搜索，避免从开头重复查找。
  //
  // 例如：
  // "{{ message }}" 中，closeIndex 指向 "}}" 的第一个 "}"。
  const closeIndex = context.source.indexOf(close, open.length);

  // 如果找不到 "}}"，说明当前插值没有闭合。
  // 返回 undefined，让上层解析逻辑决定如何处理。
  if (closeIndex === -1) return undefined;

  // ③ 记录整个插值表达式的起始位置。
  // 例如 "{{ message }}"，start 指向第一个 "{"。
  const start = getCursor(context);

  // ④ 消费开始符 "{{"。
  // 消费前：{{ message }}
  // 消费后： message }}
  advanceBy(context, open.length);

  // ⑤ 记录插值内部内容的起始位置。
  // 此时指向 message 前面的空格（如果存在）。
  const innerStart = getCursor(context);

  // ⑥ 先将 innerEnd 初始化为当前位置。
  // 后面会根据去掉空白后的内容，更新它的位置。
  const innerEnd = getCursor(context);

  // ⑦ 计算插值内部原始内容的长度。
  //
  // closeIndex 是从原始源码开头计算的索引；
  // open.length 是 "{{" 的长度。
  //
  // 例如 "{{ message }}"：
  // closeIndex - 2 得到 " message " 的长度。
  const rawContentLength = closeIndex - open.length;

  // ⑧ 截取插值内部的原始内容，但暂时不改变 context。
  // 例如：
  // "{{ message }}" -> rawContent = " message "
  const rawContent = context.source.slice(0, rawContentLength);

  // ⑨ 读取并消费这些原始内容。
  // preTrimContent 保留原始空格；
  // context.source 则前进到 "}}" 开头的位置。
  const preTrimContent = parseTextData(context, rawContentLength);

  // ⑩ 去掉表达式首尾的空白。
  // " message " -> "message"
  const content = preTrimContent.trim();

  // ⑪ 找到去掉前导空白后，内容从原始字符串的哪个位置开始。
  //
  // 例如：
  // preTrimContent = "  message  "
  // content        = "message"
  // startOffset    = 2
  //
  // 如果没有前导空白，startOffset 就是 0。
  const startOffset = preTrimContent.indexOf(content);

  // ⑫ 如果存在前导空白，就把 innerStart 向后移动。
  // 这样 innerStart 指向真正表达式内容的开头，
  // 而不是开头的空格。
  if (startOffset > 0) {
    advancePositionWithMutation(innerStart, rawContent, startOffset);
  }

  // ⑬ 计算真正表达式内容的结束位置。
  //
  // rawContentLength：原始内容总长度
  // preTrimContent.length - content.length：被 trim 去掉的空白总长度
  // startOffset：前导空白长度
  //
  // 该公式最终得到表达式内容结束位置相对于
  // 原始内容开头的偏移量。
  const endOffset =
    rawContentLength - (preTrimContent.length - content.length - startOffset);

  // ⑭ 将 innerEnd 移动到表达式内容的末尾。
  advancePositionWithMutation(innerEnd, rawContent, endOffset);

  // ⑮ 消费结束符 "}}"。
  // 此时整个 "{{ ... }}" 已经被消费完毕。
  advanceBy(context, close.length);

  // ⑯ 返回插值节点。
  return {
    type: NodeTypes.INTERPOLATION,

    // 表达式内容是去掉首尾空白后的文本。
    // 例如：{{ message }} -> "message"
    content,

    // 整个插值表达式的源码范围。
    // 注意：这里的 loc 包含 "{{"、内部空格和 "}}"。
    loc: getSelection(context, start),
  };
}
