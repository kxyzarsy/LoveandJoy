import { detectSensitiveWords, hasSensitiveWords, filterSensitiveWords, countHiddenCharacters } from './违禁词检测';

describe('违禁词检测工具', () => {
  describe('detectSensitiveWords', () => {
    it('应该返回空数组当文本不包含违禁词时', () => {
      const result = detectSensitiveWords('这是一个正常的文本');
      expect(result).toEqual([]);
    });

    it('应该返回包含的违禁词数组当文本包含违禁词时', () => {
      const result = detectSensitiveWords('这是一个包含傻逼和操的文本');
      expect(result).toEqual(['傻逼', '操']);
    });

    it('应该忽略大小写检测违禁词', () => {
      const result = detectSensitiveWords('这是一个包含FUCK和Shit的文本');
      expect(result).toEqual(['fuck', 'shit']);
    });

    it('应该返回空数组当文本为空时', () => {
      const result = detectSensitiveWords('');
      expect(result).toEqual([]);
    });

    it('应该返回空数组当文本只包含空格时', () => {
      const result = detectSensitiveWords('   ');
      expect(result).toEqual([]);
    });
  });

  describe('hasSensitiveWords', () => {
    it('应该返回false当文本不包含违禁词时', () => {
      const result = hasSensitiveWords('这是一个正常的文本');
      expect(result).toBe(false);
    });

    it('应该返回true当文本包含违禁词时', () => {
      const result = hasSensitiveWords('这是一个包含傻逼的文本');
      expect(result).toBe(true);
    });

    it('应该返回false当文本为空时', () => {
      const result = hasSensitiveWords('');
      expect(result).toBe(false);
    });

    it('应该返回false当文本只包含空格时', () => {
      const result = hasSensitiveWords('   ');
      expect(result).toBe(false);
    });
  });

  describe('filterSensitiveWords', () => {
    it('应该返回原文本当文本不包含违禁词时', () => {
      const text = '这是一个正常的文本';
      const result = filterSensitiveWords(text);
      expect(result).toBe(text);
    });

    it('应该替换违禁词为*当文本包含违禁词时', () => {
      const text = '这是一个包含傻逼和操的文本';
      const result = filterSensitiveWords(text);
      expect(result).toBe('这是一个包含**和*的文本');
    });

    it('应该忽略大小写替换违禁词', () => {
      const text = '这是一个包含FUCK和Shit的文本';
      const result = filterSensitiveWords(text);
      expect(result).toBe('这是一个包含****和****的文本');
    });

    it('应该返回空字符串当文本为空时', () => {
      const result = filterSensitiveWords('');
      expect(result).toBe('');
    });

    it('应该返回原空格当文本只包含空格时', () => {
      const text = '   ';
      const result = filterSensitiveWords(text);
      expect(result).toBe(text);
    });

    it('应该替换所有违禁词当文本包含多个相同违禁词时', () => {
      const text = '傻逼傻逼傻逼';
      const result = filterSensitiveWords(text);
      expect(result).toBe('******');
    });
  });

  describe('countHiddenCharacters', () => {
    it('应该返回0当文本不包含隐藏字符时', () => {
      const text = '这是一个正常的文本';
      const result = countHiddenCharacters(text);
      expect(result).toBe(0);
    });

    it('应该返回隐藏字符的数量当文本包含隐藏字符时', () => {
      const text = '这是一个包含零宽度空格\u200B的文本';
      const result = countHiddenCharacters(text);
      expect(result).toBe(1);
    });

    it('应该返回多个隐藏字符的数量当文本包含多个隐藏字符时', () => {
      const text = '这是一个包含\u200B零宽度\u200C空格\u200D的文本\t\n\r';
      const result = countHiddenCharacters(text);
      expect(result).toBe(6);
    });

    it('应该返回0当文本为空时', () => {
      const result = countHiddenCharacters('');
      expect(result).toBe(0);
    });

    it('应该返回空格数量当文本只包含空格时', () => {
      const text = '   ';
      const result = countHiddenCharacters(text);
      expect(result).toBe(0);
    });

    it('应该返回制表符数量当文本只包含制表符时', () => {
      const text = '\t\t\t';
      const result = countHiddenCharacters(text);
      expect(result).toBe(3);
    });
  });
});
