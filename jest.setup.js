// jest.setup.js
// 设置测试环境

// 引入@testing-library/jest-dom扩展
require('@testing-library/jest-dom');

// 模拟next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn()
    },
    isReady: true
  })
}));

// 模拟next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: () => {
    return null;
  },
  Image: () => {
    return null;
  }
}));

// 模拟process.env
process.env = {
  ...process.env,
  JWT_SECRET: 'test-jwt-secret',
  NODE_ENV: 'test'
};

// 模拟Response对象（用于Node.js环境）
global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.statusText = init.statusText || 'OK';
    this.headers = new Map();
    
    if (init.headers) {
      for (const [key, value] of Object.entries(init.headers)) {
        this.headers.set(key, value);
      }
    }
  }
  
  async json() {
    return JSON.parse(this.body);
  }
  
  async text() {
    return this.body;
  }
  
  async arrayBuffer() {
    return Buffer.from(this.body);
  }
  
  async blob() {
    return new Blob([this.body]);
  }
};

// 模拟Blob对象
global.Blob = class Blob {
  constructor(parts, options = {}) {
    this.parts = parts;
    this.type = options.type || '';
  }
};

// 模拟localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0
};

// 模拟console.error，避免测试中出现不必要的错误信息
const originalError = console.error;
console.error = (...args) => {
  // 过滤掉一些不必要的错误信息
  if (/Warning: React\.createElement/.test(args[0])) {
    return;
  }
  if (/Warning: Failed prop type/.test(args[0])) {
    return;
  }
  originalError.call(console, ...args);
};
