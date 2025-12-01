// 违禁词列表
const sensitiveWords = [
  '骚', '贱', '傻逼', '操', 'fuck', 'shit',
  '政治敏感词1', '政治敏感词2', '色情敏感词1', '色情敏感词2'
];

/**
 * 检测文本中是否包含违禁词
 * @param text 待检测文本
 * @returns 包含违禁词的数组，如果没有则返回空数组
 */
export const detectSensitiveWords = (text: string): string[] => {
  const foundWords: string[] = [];
  
  sensitiveWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    if (regex.test(text)) {
      foundWords.push(word);
    }
  });
  
  return foundWords;
};

/**
 * 检查文本是否包含违禁词
 * @param text 待检测文本
 * @returns 是否包含违禁词
 */
export const hasSensitiveWords = (text: string): boolean => {
  return detectSensitiveWords(text).length > 0;
};

/**
 * 过滤文本中的违禁词，用*替换
 * @param text 待过滤文本
 * @returns 过滤后的文本
 */
export const filterSensitiveWords = (text: string): string => {
  let filteredText = text;
  
  sensitiveWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filteredText = filteredText.replace(regex, '*'.repeat(word.length));
  });
  
  return filteredText;
};

/**
 * 检测文本中的隐藏字符
 * @param text 待检测文本
 * @returns 隐藏字符的数量
 */
export const countHiddenCharacters = (text: string): number => {
  // 匹配各种隐藏字符的正则表达式
  // 包括：零宽度空格、零宽度非连接符、零宽度连接符、制表符、换行符、回车符、垂直制表符、换页符等
  const hiddenCharRegex = /[\u200B-\u200D\uFEFF\t\n\r\v\f\u0000-\u001F\u007F-\u009F]/g;
  const matches = text.match(hiddenCharRegex);
  return matches ? matches.length : 0;
};